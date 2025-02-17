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

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { TimeObject } from "../Types";
import { FormInput } from "../Components";
import { convertTo24HourFormat } from "../Utils";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { timeSlots } from "../Utils";
import { debounce } from "lodash";

/* 
 Debounced function to fetch eventname suggestions from the server. 
 Created the debounced function outside of the component to prevent recreation on every render 
 */
const fetchSuggestions = debounce(
  async (
    query: string,
    callback: (data: Array<{ eventName: string }>) => void
  ) => {
    if (query.length > 1) {
      try {
        const response = await axios.get(`/attendee/eventNames?q=${query}`);
        console.log("response of titles", response);
        callback(response.data.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        callback([]);
      }
    }
  },
  500
);

const EventAllotment = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState("");
  const [meetingEndTime, setMeetingEndTime] = useState("");
  const [displayStartTime, setDisplayStartTime] = useState("");
  const [displayEndTime, setDisplayEndTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [multipleAttendees, setMultipleAttendees] = useState(false);
  /************************************************************** */
  const [suggestions, setSuggestions] = useState<Array<{ eventName: string }>>(
    []
  );

  // Handle input change and trigger suggestions fetch
  const handleEventNameChange = (value: string) => {
    setSuggestions([]);
    console.log("Value of meeting: ", value);

    setEventName(value);

    // Call the debounced function with the value and a callback
    fetchSuggestions(value, (data) => {
      setSuggestions(data);
    });
  };

  /* 
  Clean up the debounced function when component unmounts.
  Think of debouncing like a timer system. When you type, instead of doing something immediately, 
  it sets a timer to do that thing later. If you type again before the timer finishes, it resets the timer. 
  This helps prevent too many actions from happening at once. In our code, every time someone types in the 
  input field, we're setting up one of these timers through the debounced function. Here's what can happen 
  without cleanup:
    1. User types "a" - A timer starts (waiting 500ms)
    2 .User types "ab" - First timer is reset, new timer starts
    3. User quickly navigates away from the page
    4. 500ms passes, and those timers try to run their callbacks

  The problem is that these timers continue to exist even after the user has left the page or the component 
  has unmounted. When they finally execute, they'll try to update state (through setSuggestions) on a component 
  that no longer exists. This can cause memory leaks and the dreaded "Can't perform a React state update on 
  an unmounted component" warning. 
  */
  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, []);

  const { state } = useLocation();
  console.log(state);
  const { userDates, username, userData } = state;
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

  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    // if (selectedDate && meetingStartTime && meetingEndTime && eventName) {
    //   alert(
    //     `${eventName} scheduled for ${selectedDate} from ${meetingStartTime} to ${meetingEndTime}`
    //   );
    //   // Here you would typically make an API call to save the meeting
    // }

    // send this data to DB
    setIsScheduling(true);
    const userSchedulingData = {
      username: username, // alternatively, you can just write username instead of username: username (es6 feature)
      schedule: {
        meetingStartTime: new Date(`${selectedDate} ${meetingStartTime}`),
        meetingEndTime: new Date(`${selectedDate} ${meetingEndTime}`),
      },
      eventName,
      multipleAttendees,
    };
    console.log(userSchedulingData);
    try {
      const response = await axios.post(
        "/attendee/add-attendee",
        userSchedulingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Attendee added successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          toast.error("Trying to provide invalid/inadmissible data!");
          throw new Error(error.message);
        }
        if (error.status === 409) {
          toast.error(
            "Either something's wrong with time provided or multiple attendees not allowed for this session!"
          );
          throw new Error(error.message);
        }
      }
      toast.error("Some error while trying to add attendee :(");
      throw new Error("Some error while trying to add attendee :(");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-8 text-center">
        Schedule a Meeting
      </h1>
      <div className="flex justify-between mt-4 mb-8">
        <Link to={`/admin/${userData._id}`}>
          <button className="btn btn-outline btn-primary hover:!text-white">
            Back to Admin Dashboard
          </button>
        </Link>
        <Link to={`/admin/${userData._id}/sessions`} state={userData}>
          <button className="btn btn-outline btn-accent hover:!text-white">
            Upcoming Sessions
          </button>
        </Link>
      </div>

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
            handleInputChange={handleEventNameChange}
            value={eventName}
          />
          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 bg-base-200 border border-base-300 rounded-md mt-1 shadow-lg">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.eventName}
                  onClick={() => {
                    setEventName(suggestion.eventName);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white"
                >
                  {suggestion.eventName}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-base-200 p-4 rounded-lg col-span-full">
          <h1 className="text-2xl font-bold mb-4">Meeting Type</h1>
          <FormInput
            label="Multiple Attendees?"
            name="multipleAttendees"
            type="checkbox"
            handleInputChange={setMultipleAttendees}
            value={multipleAttendees}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSchedule}
          className="btn btn-outline hover:!text-white btn-primary"
          disabled={
            !selectedDate ||
            !meetingStartTime ||
            !meetingEndTime ||
            !eventName ||
            isScheduling
          }
        >
          {isScheduling ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </div>
    </div>
  );
};

export default EventAllotment;
