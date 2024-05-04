import { useState } from "react";
import { connect } from "react-redux";
import Input from "../../Shared/UI/Input";
import Button from "../../Shared/UI/Button";
import Header from "../../Shared/UI/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "../../Shared/UI/Calendar";
import Time from "../../Shared/UI/Time";
import TripRequests from "../../Requests/TripRequests";
import { fetchUpdatedTrips } from "../../Redux/Operations/AccountOperations";
import Checkbox from "../../Shared/UI/Checkbox";
import ImageUploading from "react-images-uploading";
import Loading from "../../Shared/UI/Loading";

const DEFAULT_FORM_DATA = {
  activityName: null,
  location: null,
  ticketed: false,
  tickets: new Date(),
  activityDate: new Date(),
  activityTime: new Date(),
};

function Activity({ fetchUpdatedTrips, ...props }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const tripRequest = new TripRequests();

  const handleChange = (event) => {
    const targetKey = event.target.name;
    const newValue = event.target.value;

    setFormData((prevState) => ({ ...prevState, [targetKey]: newValue }));
  };

  // onSave is for new activities
  const saveActivity = async () => {
    setLoading(true);

    if (!formData.nameOnReservation) {
      formData.nameOnReservation =
        props.userData?.firstName + " " + props.userData?.lastName;
    }

    formData.tripId = props.activeTripId;
    tripRequest
      .addActivity(formData)
      .then(() => {
        fetchUpdatedTrips().then(() => props.navigate("/activities"));
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  };

  const toggleTickedActivity = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ticketed: !prevFormData.ticketed,
    }));
  };

  const handleActivityTime = (time) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      activityTime: time,
    }));
  };

  const handleActivityDate = (date) => {
    let today = new Date().getTime();
    let selectedDate = new Date(date).getTime();

    if (today > selectedDate) {
      console.error("Cannot select date in the past.");
      return;
    }

    if (today < selectedDate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        departureDate: date,
      }));
    }
  };

  const handleTicketUpload = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setUploads(imageList);
  };

  const renderOptionsBox = () => {
    return (
      <>
        <div className="outlined-box p-4">
          <div className="row">
            <div className="col text-center">
              <FontAwesomeIcon
                icon="fa-solid fa-calendar-days"
                style={{ color: "#0bb6c0" }}
              />
              <span className="label mx-3">Date</span>
              <Calendar
                selectedDate={formData.activityTime}
                onDateChange={handleActivityDate}
              />
            </div>
            <div className="col text-center">
              <FontAwesomeIcon
                icon="fa-solid fa-calendar-days"
                style={{ color: "#0bb6c0" }}
              />
              <span className="label mx-3">Time</span>
              <Time
                selectedDate={formData.activityTime}
                onDateChange={handleActivityTime}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="content-body activity">
      <Header
        title="Add Activity"
        leftIcon={true}
        destination={"/activities"}
        subtitle="Add any activity, event, adventure or excursion."
        props={{
          addNew: true,
        }}
      />

      <div className="container">
        <div className="row"> {renderOptionsBox()}</div>
        <div className="row mt-2">
          <Input
            name="activity"
            onChange={handleChange}
            placeholder="Activity"
            label="Name of Activity "
            value={formData.name}
          />

          <Input
            name="location"
            onChange={handleChange}
            placeholder="Location"
            label="Location"
            value={formData.location}
          />
        </div>
        <div className="ticketed row mt-2">
          <Checkbox
            label="Upload tickets for this event."
            toggleCheckbox={toggleTickedActivity}
          />
          {formData.ticketed ? (
            <ImageUploading
              multiple
              value={uploads}
              onChange={handleTicketUpload}
              maxNumber={12}
              dataURLKey="data_url"
              acceptType={["jpg", "png"]}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <div className="upload__image-wrapper mt-3">
                  <div className="w-50">
                    <Button
                      label="Select File"
                      style={isDragging ? { color: "red" } : null}
                      onClick={onImageUpload}
                      {...dragProps}
                    />
                  </div>
                  <div className="b13-mon mt-1">
                    * Only 'PNG' or 'JPG' image files are allowed.
                  </div>

                  <div className="container">
                    <div className="row">
                      {imageList.map((image, index) => (
                        <div key={index} className="col-4 mt-2 p-1">
                          <div className="d-flex flex-column align-items-start image-item">
                            <img
                              src={image.data_url}
                              alt=""
                              className="cropped-ticket"
                            />
                            <div
                              className="mx-2 error-color b13-mon"
                              onClick={() => onImageRemove(index)}
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ImageUploading>
          ) : null}
        </div>
        <div className="row mt-3">
          <div className="col d-flex align-self-center">
            <Button label="Save" onClick={saveActivity} />
          </div>
        </div>
      </div>
      <Loading loading={loading} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userData: state.account?.userAccount,
    activeTripId: state.account?.activeTrip?._id,
    activeTrip: state.account?.activeTrip,
  };
}

const mapDispatchToProps = {
  fetchUpdatedTrips,
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
