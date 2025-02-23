// import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
// import { EventBasedData, SessionData } from "../Types";
// import { Navbar } from "../Components";
// import { logoutUser } from "../Utils";

// const AllUsersSessions = () => {
//   const { state } = useLocation();
//   console.log("state recieved:", state);

//   const allSessions = useLoaderData() as SessionData[];
//   console.log("total sessions:", allSessions);

//   const navigate = useNavigate();

//   const eventBasedData = allSessions.reduce((acc, session) => {
//     if (!acc[session.eventName]) {
//       acc[session.eventName] = [];
//     }
//     acc[session.eventName].push({
//       _id: session._id,
//       username: session.username,
//       multipleAttendees: session.multipleAttendees,
//       schedule: session.schedule,
//     });
//     return acc;
//   }, {} as EventBasedData);
//   console.log("eventBasedData:::", eventBasedData);

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-5xl mx-auto pt-8 grid grid-cols-1 gap-6 bg-transparent">
//         <Navbar
//           name={state.fullname}
//           logoutUser={() => logoutUser(navigate)}
//           isAdmin={state.isAdmin}
//         />
//       </div>
//       <section className="container mx-auto px-4 pb-12 pt-6">
//         {/* <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
//           {/* {allSessions.map((session) => {
//             const singleDateArray = Object.keys(session.schedule);
//             const fullDate = new Date(singleDateArray[0]).toDateString();
//             // console.log("fullDate", fullDate);

//             const { meetingStartTime, meetingEndTime } =
//               session.schedule[singleDateArray[0]];
//             const startTime = new Date(meetingStartTime).toLocaleTimeString();
//             const endTime = new Date(meetingEndTime).toLocaleTimeString();

//             return (
//               <div
//                 key={session._id}
//                 className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
//               >
//                 <div className="card-body">
//                   <div className="card-title text-3xl capitalize text-primary hover:text-secondary transition-colors duration-200">
//                     {session.username}
//                   </div>
//                   <div className="card-title text-2xl capitalize text-accent">
//                     Meeting Title: {session.eventName}
//                   </div>
//                   <div className="card-title text-xl text-lime-300">
//                     {fullDate}
//                   </div>
//                   <div className="flex justify-between items-center bg-base-200 rounded-lg p-2 mb-2">
//                     <span className="font-medium text-sm">{startTime}</span>
//                     <span className="text-xs">to</span>
//                     <span className="font-medium text-sm">{endTime}</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })} */}
//           {Object.keys(eventBasedData).map((event) => {
//             console.log(`${event} event`, eventBasedData[event][0]);
//             const eventSchedule = eventBasedData[event][0].schedule;
//             const [eDate] = Object.keys(eventSchedule);

//             return (
//               <div className="dropdown dropdown-bottom" key={event}>
//                 <div tabIndex={0} role="button" className="btn m-1 capitalize">
//                   <h2 className="text-xl font-bold">{event}</h2>
//                   <br />
//                   <h2 className="text-base font-bold">Date:{eDate}</h2>
//                 </div>
//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow capitalize"
//                 >
//                   {eventBasedData[event].map((attendeeData) => {
//                     return (
//                       <li key={attendeeData._id}>
//                         <a>{attendeeData.username}</a>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             );
//           })}
//         {/* </div> */}
//       </section>
//     </div>
//   );
// };
// export default AllUsersSessions;

import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router-dom";
import { EventBasedData, SessionData } from "../Types";
import { Modal, Navbar } from "../Components";
import { logoutUser } from "../Utils";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../Config/axios.config";

const AllUsersSessions = () => {
  const { state } = useLocation();
  console.log("state received:", state);

  const allSessions = useLoaderData() as SessionData[];
  console.log("total sessions:", allSessions);

  const navigate = useNavigate();

  const eventBasedData = allSessions.reduce((acc, session) => {
    if (!acc[session.eventName]) {
      acc[session.eventName] = [];
    }
    acc[session.eventName].push({
      _id: session._id,
      username: session.username,
      multipleAttendees: session.multipleAttendees,
      schedule: session.schedule,
    });
    return acc;
  }, {} as EventBasedData);
  console.log("eventBasedData:::", eventBasedData);

  const [modalContent, setModalContent] = useState<string | null>(null);
  const handleAttendeeRemoval = () => setModalContent("Remove Attendee");
  const closeModal = () => setModalContent(null);

  const revalidator = useRevalidator();

  const removeAttendee = async (attendeeId: string) => {
    try {
      const response = await api.delete(
        `/attendee/removeAttendee/${attendeeId}`
      );
      console.log("attendee removal response:", response);
      toast.success("Attendee removed from the meeting!");
      closeModal();
      revalidator.revalidate(); // Manually re-run the loader
    } catch (error) {
      console.log(error);
      toast.error("Some error occured while trying to remove attendee :(");
      throw new Error("Some error while trying to remove attendee :(");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-0 pt-8 grid grid-cols-1 gap-6 bg-transparent">
        <Navbar
          name={state.fullname}
          logoutUser={() => logoutUser(navigate)}
          isAdmin={state.isAdmin}
        />
      </div>
      <section className="container mx-auto px-4 pb-12 pt-6">
        <div className="mb-6">
          <Link to={`/admin/${state._id}`}>
            <button className="btn btn-outline hover:!text-white btn-primary mt-4 ml-4">
              Go Back to Admin Dashboard
            </button>
          </Link>
        </div>
        {JSON.stringify(eventBasedData) === "{}" ? (
          <h2 className="text-4xl text-center font-semibold font-mono mt-20">
            No Upcoming Sessions
          </h2>
        ) : (
          <div className="grid gap-6">
            {Object.keys(eventBasedData).map((event) => (
              <div
                key={event}
                className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              >
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium max-sm:flex max-sm:flex-col max-sm:justify-center">
                  <span className="bg-accent text-slate-100 rounded-2xl px-3 py-2 capitalize mr-2">
                    {event}
                  </span>
                  <span className="text-sm text-gray-500 my-1 max-sm:ml-2">
                    {eventBasedData[event].length} attendees
                  </span>
                  <span
                    className={`ml-2 badge ${eventBasedData[event][0].multipleAttendees ? "badge-success" : "badge-error"} badge-outline`}
                  >
                    {eventBasedData[event][0].multipleAttendees
                      ? "Multiple Attendees"
                      : "Single Attendee Only"}
                  </span>
                </div>
                <div className="collapse-content">
                  {eventBasedData[event].map((attendeeDoc) => {
                    const { meetingStartTime, meetingEndTime } =
                      attendeeDoc.schedule;
                    const date = new Date(meetingStartTime).toDateString();
                    const startTime = new Date(
                      meetingStartTime
                    ).toLocaleTimeString();
                    const endTime = new Date(
                      meetingEndTime
                    ).toLocaleTimeString();
                    return (
                      <div
                        key={attendeeDoc._id}
                        className="card bg-neutral text-neutral-content my-2"
                      >
                        <div className="card-body p-4">
                          <h3 className="card-title text-xl capitalize">
                            {attendeeDoc.username}
                          </h3>
                          <div
                            key={date}
                            className="mt-2 lg:flex lg:flex-row lg:items-center lg:gap-4"
                          >
                            <div>
                              <span className="text-gray-200 font-semibold">
                                Date:
                              </span>
                              {" " + date}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="badge badge-secondary badge-outline mr-2">
                                {startTime} - {endTime}
                              </span>
                            </div>
                            <button
                              className="btn btn-sm bg-red-400 mt-2 lg:mt-0 hover:bg-red-700 text-white"
                              onClick={handleAttendeeRemoval}
                            >
                              Remove Attendee
                            </button>
                          </div>
                        </div>
                        <Modal
                          isOpen={modalContent === "Remove Attendee"}
                          onClose={closeModal}
                        >
                          <h2 className="text-xl font-bold mt-2">
                            Confirm Attendee Removal
                          </h2>
                          <p>
                            Are you sure you want to remove the attendee from
                            this meeting?
                          </p>
                          <button
                            className="btn btn-sm btn-primary mt-4 text-slate-100 border-neutral-300 hover:scale-105 hover:bg-red-700"
                            onClick={() => removeAttendee(attendeeDoc._id)}
                          >
                            Remove Attendee
                          </button>
                        </Modal>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllUsersSessions;
