import { useState } from "react";
import axios, { AxiosError } from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AvailabilityProps, userLoaderData } from "../Types";
import { nanoid } from "nanoid";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navbar } from "../Components";
import { dateOptions } from "../Utils/Utils";

const UserAvailability = () => {
  const { userData, userAvailabilities } = useLoaderData() as userLoaderData;

  if (userData.isAdmin) {
    throw new Error(
      `There no user with the id:${userData._id}. Are you an admin?`
    );
  }
  const [availability, setAvailability] = useState<AvailabilityProps>({
    userId: userData._id,
    startDateAndTime: new Date(),
    endDateAndTime: new Date(),
    // startDate: new Date().toLocaleDateString(),
    // endDate: new Date().toLocaleDateString(),
    // startTime: new Date().toLocaleTimeString(),
    // endTime: new Date().toLocaleTimeString(),
  });
  console.log(availability);

  const [availabilityList, setAvailabilityList] =
    useState<AvailabilityProps[]>(userAvailabilities);

  const navigate = useNavigate();

  const updateAvailability = async () => {
    // console.log(
    //   "Check for startDateAndTime to be less than endDateAndTime",
    //   availability.startDateAndTime < availability.endDateAndTime
    // );
    try {
      const response = await axios.post(
        "/availability/add-availability",
        availability,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("AddAvailability::", response);
      const availabilityDoc = response.data.data;
      setAvailabilityList((availabilityList) => [
        ...availabilityList,
        availabilityDoc,
      ]);
      toast.success(response.data.message);
      console.log("updateAvailability RAN!");
      console.log(availabilityList);
    } catch (error) {
      console.error("Error::", error);
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          toast.error("Trying to provide invalid/inadmissible data!");
          throw new Error(error.message);
        }
        if (error.status === 406) {
          toast.error(
            "Please don't create time slots ranging from one date to another."
          );
          throw new Error(error.message);
        }
        if (error.status === 409) {
          toast.error(
            "Conflicts between the provided time slot and available time slots!"
          );
          throw new Error(error.message);
        }
      }
      toast.error("Some error while trying to add availability :(");
      throw new Error("Some error while trying to add availability :(");
    }
  };

  const deleteAvailability = async (docID: string) => {
    console.log("docID", docID);

    try {
      const response = await axios.delete(
        `/availability/deleteAvailability/${docID}`
      );
      console.log(response);
      const updatedList = availabilityList.filter((item) => item._id !== docID);
      console.log("List after deletion", updatedList);
      setAvailabilityList(updatedList);
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
        console.error(error.message);
        throw new Error(error.message);
      }
      toast.error("Something went wrong while deleting availability");
      throw new Error("Something went wrong while deleting availability");
    }
  };

  const setStartDateAndTime = (date: Date) => {
    console.log("This is start date and time:::", date);
    console.log("This is startDate:", date.toLocaleDateString());
    console.log("This is startTime:", date.toLocaleTimeString());

    setAvailability((prevAvailability) => {
      return {
        ...prevAvailability,
        userId: userData._id,
        startDateAndTime: date,
        // startDate: date.toLocaleDateString(),
        // startTime: date.toLocaleTimeString(),
      };
    });
  };

  const setEndDateAndTime = (date: Date) => {
    console.log("This is end date and time:::", date);
    console.log("This is endDate:", date.toLocaleDateString());
    console.log("This is endTime:", date.toLocaleTimeString());
    setAvailability((prevAvailability) => {
      return {
        ...prevAvailability,
        userId: userData._id,
        endDateAndTime: date,
        // endDate: date.toLocaleDateString(),
        // endTime: date.toLocaleTimeString(),
      };
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
      <Navbar name={userData.fullname} logoutUser={logoutUser} />
      <section className="w-full mx-auto p-8 bg-base-200 shadow-xl rounded-xl">
        <h2 className="text-center text-3xl font-semibold mb-6 text-secondary">
          Set Availability
        </h2>
        <div className="flex justify-between mb-6">
          <Link
            to="/sessions"
            className="btn btn-outline btn-accent hover:!text-white"
          >
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
              timeIntervals={15}
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
              timeIntervals={15}
              dateFormat="Pp"
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <button
          onClick={updateAvailability}
          className="btn btn-primary btn-block mt-8 btn-outline hover:!text-white"
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
                    {`${new Date(item.startDateAndTime).toLocaleString("en-GB", dateOptions)} -to- ${new Date(item.endDateAndTime).toLocaleString("en-GB", dateOptions)}`}
                  </span>
                  <button
                    onClick={() => deleteAvailability(item._id as string)}
                    className="btn btn-primary text-gray-100 hover:bg-red-700 btn-sm"
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
