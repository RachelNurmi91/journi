import { Route, Routes, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Summary from "../Trip/Summary";
import HotelList from "../Trip/Hotels/HotelList";
import Hotel from "../Trip/Hotels/Hotel";
import Login from "../Account/AccountAccess/Login";
import FlightList from "../Trip/Flights/FlightList";
import AddFlight from "../Trip/Flights/AddFlight";
import Register from "../Account/AccountAccess/Register";
import TripList from "../Trip/Trips/TripList";
import AddTrip from "../Trip/Trips/AddTrip";
import Profile from "../Account/Profile";
import RewardProgram from "../Account/RewardProgram";

function Content({ ...props }) {
  const navigate = useNavigate();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="*" element={<Summary />} />
        <Route path="/login" element={<Login navigate={navigate} />} />
        <Route path="/register" element={<Register navigate={navigate} />} />
        {props.userId && (
          <>
            <Route path="/profile" element={<Profile navigate={navigate} />} />

            <Route
              path="/profile/programs/*"
              element={<RewardProgram navigate={navigate} />}
            />

            <Route path="/hotels" element={<HotelList />} />
            <Route path="/hotels/*" element={<Hotel navigate={navigate} />} />
            <Route path="/flights" element={<FlightList />} />
            <Route
              path="/flights/add"
              element={<AddFlight navigate={navigate} />}
            />
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/add" element={<AddTrip />} />
          </>
        )}
      </Routes>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userId: state.account?.userAccount?.id,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
