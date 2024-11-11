import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Components";
import { logoutUser } from "../Utils";
import { SessionData } from "../Types";

const UserSessions = () => {
  const { state } = useLocation();
  // console.log("state recieved:", state);

  const mySessions = useLoaderData() as SessionData[];
  console.log("My sessions:", mySessions);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto pt-8 grid grid-cols-1 gap-6 bg-transparent">
        <Navbar
          name={state.fullname}
          logoutUser={() => logoutUser(navigate)}
          isAdmin={false}
        />
      </div>
      <section className="container mx-auto px-4 pb-12 pt-6">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mySessions.map((session) => {
            const singleDateArray = Object.keys(session.schedule);
            const fullDate = new Date(singleDateArray[0]).toDateString();
            // console.log("fullDate", fullDate);

            const { meetingStartTime, meetingEndTime } =
              session.schedule[singleDateArray[0]];
            const startTime = new Date(meetingStartTime).toLocaleTimeString();
            const endTime = new Date(meetingEndTime).toLocaleTimeString();

            return (
              <div
                key={session._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="card-body">
                  <div className="card-title text-2xl text-accent capitalize hover:text-secondary transition-colors duration-200">
                    {session.eventName}
                  </div>
                  <div className="card-title text-xl text-lime-400">
                    {fullDate}
                  </div>
                  <div className="flex justify-between items-center bg-base-200 rounded-lg p-2 mb-2">
                    <span className="font-medium text-sm">{startTime}</span>
                    <span className="text-xs">to</span>
                    <span className="font-medium text-sm">{endTime}</span>
                  </div>
                  <span
                    className={`badge ${session.multipleAttendees ? "badge-success" : "badge-error"} badge-outline`}
                  >
                    {session.multipleAttendees
                      ? "Multiple Attendees"
                      : "Single Attendee"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
export default UserSessions;
