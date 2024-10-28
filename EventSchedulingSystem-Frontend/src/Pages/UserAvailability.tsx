import { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AvailabilityProps, UserData } from "../Types";
import { nanoid } from "nanoid";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../Components";

const UserAvailability = () => {
  const { fullname, _id, isAdmin } = useLoaderData() as UserData;

  if (isAdmin) {
    throw new Error(`There no user with the id:${_id}`);
  }
  const [availability, setAvailability] = useState<AvailabilityProps>({
    userId: _id,
    startDateAndTime: new Date(),
    endDateAndTime: new Date(),
    // startDate: new Date().toLocaleDateString(),
    // endDate: new Date().toLocaleDateString(),
    // startTime: new Date().toLocaleTimeString(),
    // endTime: new Date().toLocaleTimeString(),
  });
  console.log(availability);

  const [availabilityList, setAvailabilityList] = useState<AvailabilityProps[]>(
    []
  );

  const navigate = useNavigate();

  const updateAvailability = () => {
    // console.log(
    //   "Check for startDateAndTime to be less than endDateAndTime",
    //   availability.startDateAndTime < availability.endDateAndTime
    // );
    
    setAvailabilityList((availabilityList) => [
      ...availabilityList,
      availability,
    ]);
    console.log("updateAvailability RAN!");

    console.log(availabilityList);
  };

  const deleteAvailability = (docID: string) => {
    const updatedList = availabilityList.filter((item) => item._id !== docID);
    console.log(updatedList);

    setAvailabilityList(updatedList);
  };

  const setStartDateAndTime = (date: Date) => {
    console.log("This is start date and time:::", date);
    console.log("This is startDate:", date.toLocaleDateString());
    console.log("This is startTime:", date.toLocaleTimeString());

    setAvailability({
      ...availability,
      userId: _id,
      startDateAndTime: date,
      // startDate: date.toLocaleDateString(),
      // startTime: date.toLocaleTimeString(),
    });
  };

  const setEndDateAndTime = (date: Date) => {
    console.log("This is end date and time:::", date);
    console.log("This is endDate:", date.toLocaleDateString());
    console.log("This is endTime:", date.toLocaleTimeString());
    setAvailability({
      ...availability,
      userId: _id,
      endDateAndTime: date,
      // endDate: date.toLocaleDateString(),
      // endTime: date.toLocaleTimeString(),
    });
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post("/users/logout", {});
      console.log(response);
      toast(response.data?.message || "You have Logged-Out Successfully :)");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 grid grid-cols-1 gap-6">
      <Navbar name={fullname} logoutUser={logoutUser} />
      <section className="w-full mx-auto p-8 bg-base-200 shadow-xl rounded-xl">
        <h2 className="text-center text-3xl font-semibold mb-6 text-secondary">
          Set Availability
        </h2>
        <div className="flex justify-between mb-6">
          <Link to="/sessions" className="btn btn-outline btn-accent">
            Upcoming Sessions
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xl">Start Time</span>
            </label>
            <DatePicker
              selected={availability.startDateAndTime}
              onChange={(date) => setStartDateAndTime(date as Date)}
              showTimeSelect
              dateFormat="Pp"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xl">End Time</span>
            </label>
            <DatePicker
              selected={availability.endDateAndTime}
              onChange={(date) => setEndDateAndTime(date as Date)}
              showTimeSelect
              dateFormat="Pp"
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <button
          onClick={updateAvailability}
          className="btn btn-primary btn-block mt-8"
        >
          Add Availability
        </button>

        {availabilityList.length > 0 && (
          <div className="mt-12">
            <h4 className="text-2xl font-semibold mb-4">Your Availability</h4>
            <ul className="space-y-4">
              {availabilityList.map((item) => (
                <li
                  key={nanoid()}
                  className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow"
                >
                  <span className="text-sm md:text-base">
                    {`${item.startDateAndTime.toLocaleString()} - ${item.endDateAndTime.toLocaleString()}`}
                  </span>
                  <button
                    onClick={() => deleteAvailability(item._id as string)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserAvailability;
