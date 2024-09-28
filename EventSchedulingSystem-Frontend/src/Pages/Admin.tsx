import { Link } from "react-router-dom";
import { users } from "../../userData";
import { TimeObject, UserNameAndDateBasedUsersData } from "../Types/Types";

const Admin = () => {
  //   const groupUsersByName = (users: User[]) => {
  //     return users.reduce((acc: GroupedUsers, user) => {
  //       if (!acc[user.username]) {
  //         acc[user.username] = [];
  //       }
  //       acc[user.username].push(user);
  //       return acc;
  //     }, {});
  //   };

  //   const groupedUsers = groupUsersByName(users);
  //   console.log(groupedUsers);

  //   const objKeys = Object.values(groupedUsers)
  //   console.log(objKeys);
  //   const usersSortedByDate = objKeys.map(user => {
  //     if (user.length > 1) {

  //     }

  //   })

  //   // const usersSortedByDates = groupedUsers.map(user => {
  //   //   if (user.length > 1) {

  //   //   }
  //   // })

  const userNameAndDateBasedUsersData = users.reduce(
    (acc: UserNameAndDateBasedUsersData, user) => {
      // Initialize an entry for the username if it doesn't exist
      if (!acc[user.username]) {
        acc[user.username] = {};
      }
      // Initialize an entry for the date if it doesn't exist
      if (!acc[user.username][user.startDate]) {
        acc[user.username][user.startDate] = [];
      }
      // Add the user's start and end time to the respective date
      acc[user.username][user.startDate].push({
        startTime: user.startTime,
        endTime: user.endTime,
      });

      // Sort the dates and rebuild the object in the correct order
      const sortedDates = Object.keys(acc[user.username]).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      // console.log("sortedDates", sortedDates);

      // Rebuild the object with sorted dates
      const sortedDateEntries: { [key: string]: TimeObject[] } = {};
      sortedDates.forEach((date) => {
        sortedDateEntries[date] = acc[user.username][date];
      });
      // console.log("sortedDateEntries", sortedDateEntries);

      acc[user.username] = sortedDateEntries;
      return acc;
    },
    {}
  );
  console.log("UserNameAndDateBasedUsersData", userNameAndDateBasedUsersData);

  // Break down of fetching usernames in Step 2
  // const userNameArray = Object.keys(userNameAndDateBasedUsersData);
  // console.log("USERNAME ARRAY",userNameArray);
  // [
  //   "Dhananjaya",
  //   "Savita",
  //   "Arjun",
  //   "Surya"
  // ]

  // Break down of sorting in Step 2
  // const dataInsideUsername = userNameArray.map((username) => {
  //   console.log("SORT", Object.keys(userNameAndDateBasedUsersData[username]).sort());
  //   return Object.keys(userNameAndDateBasedUsersData[username]);
  // });
  // console.log("DATA INSIDE USERNAME", dataInsideUsername);

  // Step 2: Sort the data by date and time
  const sortedData = Object.keys(userNameAndDateBasedUsersData).map(
    (username) => {
      return {
        username,
        dates: Object.keys(userNameAndDateBasedUsersData[username])
          .sort((a, b) => {
            // Convert the date strings into actual Date objects and compare them
            return new Date(a).getTime() - new Date(b).getTime();
          })
          .map((date) => {
            // Sort the times for each date
            // console.log("SORTING OF TIME OBJECTS STARTED... ");
            // console.log("DATE: ", userNameAndDateBasedUsersData[username][date].sort());

            const times = userNameAndDateBasedUsersData[username][date].sort(
              (a: TimeObject, b: TimeObject) => {
                // console.log("a and b:", a, b);

                // Convert the 12-hour format startTime into a 24-hour format for comparison
                const timeA = convertTo24HourFormat(a.startTime);
                const timeB = convertTo24HourFormat(b.startTime);

                // Compare the two 24-hour format times as strings
                return timeA.localeCompare(timeB);
              }
            );
            // console.log("times", times);

            return { date, times };
          }),
      };
    }
  );
  console.log("SORTED DATA:", sortedData);

  // Helper function to convert 12-hour time to 24-hour format
  function convertTo24HourFormat(time: string): string {
    const [timePart, modifier] = time.split(" ");
    // console.log(timePart.split(":"));

    const [tempHours, minutes, seconds] = timePart.split(":"); // 'hours' may change, so it's kept as let.
    let hours = tempHours;
    // Convert "12" hour correctly
    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12";
    } else if (modifier === "PM") {
      hours = String(Number(hours) + 12);
    }

    return `${hours.padStart(2, "0")}:${minutes}:${seconds}`;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 text-base-content">
      {/* <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-primary">
          Welcome, Admin
        </h2>
        <div className="flex justify-end mb-8">
          <Link
            to="/sessions"
            className="btn btn-primary btn-md hover:btn-secondary transition-colors duration-300"
          >
            Upcoming Sessions
          </Link>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedData.map((user) => (
            <div
              key={user.username}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="card-body">
                <Link
                  to={`user/${user.username}`}
                  state={{ user }}
                  className="card-title text-2xl text-primary hover:text-secondary transition-colors duration-200"
                >
                  {user.username}
                </Link>
                {user.dates.map((dateInfo) => (
                  <div key={dateInfo.date} className="mt-4">
                    <h4 className="font-semibold text-lg text-accent mb-2">
                      {new Date(dateInfo.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                    {dateInfo.times.map((time: TimeObject, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-base-200 rounded-lg p-2 mb-2"
                      >
                        <span className="font-medium text-sm">
                          {time.startTime}
                        </span>
                        <span className="text-xs">to</span>
                        <span className="font-medium text-sm">
                          {time.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-primary">
          Welcome, Admin
        </h2>
        <div className="flex justify-end mb-8">
          <Link
            to="/sessions"
            className="btn btn-primary btn-md hover:btn-secondary transition-colors duration-300"
          >
            Upcoming Sessions
          </Link>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.keys(userNameAndDateBasedUsersData).map((user) => (
            <div
              key={user}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="card-body">
                <Link
                  to={`user/${user}`}
                  state={{
                    userDates: userNameAndDateBasedUsersData[user],
                    username: user,
                  }}
                  className="card-title text-2xl text-primary hover:text-secondary transition-colors duration-200"
                >
                  {user}
                </Link>
                {Object.keys(userNameAndDateBasedUsersData[user]).map(
                  (date) => (
                    <div key={date} className="mt-4">
                      <h4 className="font-semibold text-lg text-accent mb-2">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h4>
                      {userNameAndDateBasedUsersData[user][date].map(
                        (time: TimeObject, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-base-200 rounded-lg p-2 mb-2"
                          >
                            <span className="font-medium text-sm">
                              {time.startTime}
                            </span>
                            <span className="text-xs">to</span>
                            <span className="font-medium text-sm">
                              {time.endTime}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Admin;
