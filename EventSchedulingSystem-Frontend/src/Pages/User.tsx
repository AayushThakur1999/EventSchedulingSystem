import { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AvailabilityProps } from "../Types/Types";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";

const User = () => {
  const [availability, setAvailability] = useState<AvailabilityProps>({
    id: nanoid(),
    startDateAndTime: new Date(),
    endDateAndTime: new Date(),
    startDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString(),
    startTime: new Date().toLocaleTimeString(),
    endTime: new Date().toLocaleTimeString(),
  });
  const [availabilityList, setAvailabilityList] = useState<AvailabilityProps[]>(
    []
  );

  const updateAvailability = () => {
    setAvailabilityList(availabilityList => [...availabilityList, availability]);
    console.log("updateAvailability RAN!");
    
    console.log(availabilityList);
    
  };

  const deleteAvailability = (id: string) => {
    const updatedList = availabilityList.filter((item) => item.id !== id);
    console.log(updatedList);

    setAvailabilityList(updatedList);
  };

  const setStartDateAndTime = (date: Date) => {
    setAvailability({
      ...availability,
      id: nanoid(),
      startDateAndTime: date,
      startDate: date.toLocaleDateString(),
      startTime: date.toLocaleTimeString(),
    });
  };

  const setEndDateAndTime = (date: Date) => {
    setAvailability({
      ...availability,
      id: nanoid(),
      endDateAndTime: date,
      endDate: date.toLocaleDateString(),
      endTime: date.toLocaleTimeString(),
    });
  };

  return (
    <section className="max-w-4xl mx-auto my-8 p-8 bg-base-200 shadow-xl rounded-xl">
      <h2 className="text-center text-4xl font-bold mb-6 text-primary">Set Availability</h2>
      <div className="flex justify-end mb-6">
        <Link to="/sessions" className="btn btn-outline btn-primary">
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
              <li key={nanoid()} className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow">
                <span className="text-sm md:text-base">
                  {`${item.startDateAndTime.toLocaleString()} - ${item.endDateAndTime.toLocaleString()}`}
                </span>
                <button
                  onClick={() => deleteAvailability(item.id)}
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
  );
};

export default User;
