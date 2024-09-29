// import { useLocation } from "react-router-dom";
// import type { User } from "../types/types";

// const UserScheduling = () => {
//   const { state } = useLocation();
//   return (
//     <section className="w-3/4 h-screen mx-auto grid place-items-center bg-userBg bg-cover bg-center min-h-screen">
//       <ul className="text-xl text-center bg-[#2C5F2D] text-[#c0f07d] rounded-xl p-8">
//         <li className="text-4xl font-semibold">{state.name}</li>
//         {state.userGroup.map((user: User) => (
//           <li key={user.id}>
//             <strong>Start:</strong> {user.startDateAndTime} <br />
//             <strong>End:</strong> {user.endDateAndTime}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };
// export default UserScheduling;

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";
import { TimeObject } from "../Types/Types";
import { convertTo24HourFormat } from "../Utils/Utils";
import { FormInput } from "../Components";

const timeSlots = [
  "12:00:00 AM",
  "12:15:00 AM",
  "12:30:00 AM",
  "12:45:00 AM",
  "01:00:00 AM",
  "01:15:00 AM",
  "01:30:00 AM",
  "01:45:00 AM",
  "02:00:00 AM",
  "02:15:00 AM",
  "02:30:00 AM",
  "02:45:00 AM",
  "03:00:00 AM",
  "03:15:00 AM",
  "03:30:00 AM",
  "03:45:00 AM",
  "04:00:00 AM",
  "04:15:00 AM",
  "04:30:00 AM",
  "04:45:00 AM",
  "05:00:00 AM",
  "05:15:00 AM",
  "05:30:00 AM",
  "05:45:00 AM",
  "06:00:00 AM",
  "06:15:00 AM",
  "06:30:00 AM",
  "06:45:00 AM",
  "07:00:00 AM",
  "07:15:00 AM",
  "07:30:00 AM",
  "07:45:00 AM",
  "08:00:00 AM",
  "08:15:00 AM",
  "08:30:00 AM",
  "08:45:00 AM",
  "09:00:00 AM",
  "09:15:00 AM",
  "09:30:00 AM",
  "09:45:00 AM",
  "10:00:00 AM",
  "10:15:00 AM",
  "10:30:00 AM",
  "10:45:00 AM",
  "11:00:00 AM",
  "11:15:00 AM",
  "11:30:00 AM",
  "11:45:00 AM",
  "12:00:00 PM",
  "12:15:00 PM",
  "12:30:00 PM",
  "12:45:00 PM",
  "01:00:00 PM",
  "01:15:00 PM",
  "01:30:00 PM",
  "01:45:00 PM",
  "02:00:00 PM",
  "02:15:00 PM",
  "02:30:00 PM",
  "02:45:00 PM",
  "03:00:00 PM",
  "03:15:00 PM",
  "03:30:00 PM",
  "03:45:00 PM",
  "04:00:00 PM",
  "04:15:00 PM",
  "04:30:00 PM",
  "04:45:00 PM",
  "05:00:00 PM",
  "05:15:00 PM",
  "05:30:00 PM",
  "05:45:00 PM",
  "06:00:00 PM",
  "06:15:00 PM",
  "06:30:00 PM",
  "06:45:00 PM",
  "07:00:00 PM",
  "07:15:00 PM",
  "07:30:00 PM",
  "07:45:00 PM",
  "08:00:00 PM",
  "08:15:00 PM",
  "08:30:00 PM",
  "08:45:00 PM",
  "09:00:00 PM",
  "09:15:00 PM",
  "09:30:00 PM",
  "09:45:00 PM",
  "10:00:00 PM",
  "10:15:00 PM",
  "10:30:00 PM",
  "10:45:00 PM",
  "11:00:00 PM",
  "11:15:00 PM",
  "11:30:00 PM",
  "11:45:00 PM",
];

const EventAllotment = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState("");
  const [meetingEndTime, setMeetingEndTime] = useState("");
  const [displayStartTime, setDisplayStartTime] = useState("");
  const [displayEndTime, setDisplayEndTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [multipleAttendees, setMultipleAttendees] = useState(false);

  const { state } = useLocation();
  console.log(state);
  const { userDates, username } = state;
  console.log(userDates);
  //   {
  //     "9/5/2024": [
  //         {
  //             "startTime": "12:17:06 PM",
  //             "endTime": "1:00:00 PM"
  //         }
  //     ],
  //     "9/15/2024": [
  //         {
  //             "startTime": "05:28:00 PM",
  //             "endTime": "05:58:00 PM"
  //         },
  //         {
  //             "startTime": "06:28:44 PM",
  //             "endTime": "06:28:44 PM"
  //         }
  //     ]
  // }

  const handleDateClick = ({
    date,
    timeSlots,
  }: {
    date: string;
    timeSlots: TimeObject[];
  }) => {
    setSelectedDate(date);
    setDisplayStartTime(timeSlots[0].startTime);
    console.log("timeSlots[0].startTime", timeSlots[0].startTime);

    setDisplayEndTime(timeSlots[timeSlots.length - 1].endTime);
    console.log(
      "timeSlots[timeSlots.length - 1].endTime",
      timeSlots[timeSlots.length - 1].endTime
    );
  };

  const handleStartTimeClick = (time: string) => {
    setMeetingStartTime(time);
  };

  const handleEndTimeClick = (time: string) => {
    setMeetingEndTime(time);
  };

  const handleSchedule = () => {
    if (selectedDate && meetingStartTime && meetingEndTime && eventName) {
      alert(
        `${eventName} scheduled for ${selectedDate} from ${meetingStartTime} to ${meetingEndTime}`
      );
      // Here you would typically make an API call to save the meeting
    }

    // send this data to DB
    const userSchedulingData = {
      username: username,
      [selectedDate]: {
        meetingStartTime,
        meetingEndTime,
      },
      eventName,
      multipleAttendees,
    };
    console.log(userSchedulingData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule a Meeting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Select a Date</h2>
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(userDates).map((date) => (
              <button
                key={date}
                onClick={() =>
                  handleDateClick({ date, timeSlots: userDates[date] })
                }
                className={`btn ${selectedDate === date ? "btn-primary" : "btn-outline"}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded-lg grid grid-rows-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Start Time</h2>
            {selectedDate ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const convertedTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(time)}`
                  );
                  const startTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(displayStartTime)}`
                  );
                  const endTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(displayEndTime)}`
                  );

                  if (convertedTime >= startTime && convertedTime < endTime) {
                    return (
                      <button
                        key={time}
                        onClick={() => handleStartTimeClick(time)}
                        className={`btn ${meetingStartTime === time ? "btn-primary" : "btn-outline"}`}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </button>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-gray-500">Please select a date first</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Select End Time</h2>
            {selectedDate ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const convertedTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(time)}`
                  );
                  const startTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(displayStartTime)}`
                  );
                  const endTime = new Date(
                    `1970-01-01T${convertTo24HourFormat(displayEndTime)}`
                  );
                  if (convertedTime > startTime && convertedTime <= endTime) {
                    return (
                      <button
                        key={time}
                        onClick={() => handleEndTimeClick(time)}
                        className={`btn ${meetingEndTime === time ? "btn-primary" : "btn-outline"}`}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </button>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-gray-500">Please select a date first</p>
            )}
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-lg col-span-full">
          <h1 className="text-2xl font-bold mb-4">Title of Meeting</h1>
          <FormInput
            label="Meeting title"
            name="eventName"
            type="text"
            handleInputChange={setEventName}
            value={eventName}
          />
        </div>
        <div className="bg-base-200 p-4 rounded-lg col-span-full">
          <h1 className="text-2xl font-bold mb-4">Meeting Type</h1>
          <FormInput
            label="Multiple Attendees?"
            name="eventName"
            type="checkbox"
            handleInputChange={setMultipleAttendees}
            value={multipleAttendees}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSchedule}
          className="btn btn-primary"
          disabled={
            !selectedDate || !meetingStartTime || !meetingEndTime || !eventName
          }
        >
          Schedule Meeting
        </button>
      </div>
    </div>
  );
};

export default EventAllotment;
