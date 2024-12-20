import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
// import { users } from "../../userData";
import {
  adminLoaderData,
  TimeObject,
  UserNameAndDateBasedUsersData,
} from "../Types";
import { convertTo24HourFormat, logoutUser } from "../Utils";
import { Navbar } from "../Components";

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
  const { userData, allUsersAvailabilities } =
    useLoaderData() as adminLoaderData;
  console.log(
    "Userdata and allUserAvailabilities",
    userData,
    allUsersAvailabilities
  );

  const navigate = useNavigate();

  const navigation = useNavigation();

  // Check if navigation is in progress
  const isLoading = navigation.state === "loading";

  if (allUsersAvailabilities.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pt-8 grid grid-cols-1 gap-6 bg-transparent">
        <Navbar
          name={userData.fullname}
          logoutUser={() => logoutUser(navigate)}
          isAdmin={userData.isAdmin}
        />
        <section className="container mx-auto px-4 pb-12 pt-6">
          <div className="flex justify-end mb-8">
            <Link
              to="sessions"
              className="btn btn-outline btn-accent btn-md hover:!text-white"
              state={userData}
              onClick={(e) => {
                if (isLoading) e.preventDefault(); // Prevent navigation
              }}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-ring loading-md"></span>
                  Loading...
                </>
              ) : (
                "Upcoming Sessions"
              )}
            </Link>
          </div>
        </section>
        <h1 className="text-3xl font-semibold text-center font-mono">
          There are no user availabilities at the moment
        </h1>
      </div>
    );
  }

  const userNameAndDateBasedUsersData = allUsersAvailabilities.reduce(
    (acc: UserNameAndDateBasedUsersData, user) => {
      // Initialize an entry for the username if it doesn't exist
      if (!acc[user.userId.username]) {
        acc[user.userId.username] = {};
      }
      // Initialize an entry for the date if it doesn't exist
      if (
        !acc[user.userId.username][
          new Date(user.startDateAndTime).toLocaleDateString()
        ]
      ) {
        acc[user.userId.username][
          new Date(user.startDateAndTime).toLocaleDateString()
        ] = [];
      }
      // Add the user's start and end time to the respective date
      acc[user.userId.username][
        new Date(user.startDateAndTime).toLocaleDateString()
      ].push({
        startTime: new Date(user.startDateAndTime).toLocaleTimeString(),
        endTime: new Date(user.endDateAndTime).toLocaleTimeString(),
      });

      // Sort the dates and rebuild the object in the correct order
      const sortedDates = Object.keys(acc[user.userId.username]).sort(
        (a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        }
      );
      // console.log("sortedDates", sortedDates);

      // Rebuild the object with sorted dates
      const sortedDateEntries: { [key: string]: TimeObject[] } = {};
      sortedDates.forEach((date) => {
        sortedDateEntries[date] = acc[user.userId.username][date];
      });
      // console.log("sortedDateEntries", sortedDateEntries);

      acc[user.userId.username] = sortedDateEntries;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 text-base-content">
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
      <div className="max-w-5xl mx-auto pt-8 grid grid-cols-1 gap-6 bg-transparent">
        <Navbar
          name={userData.fullname}
          logoutUser={() => logoutUser(navigate)}
          isAdmin={userData.isAdmin}
        />
      </div>
      <section className="container mx-auto px-4 pb-12 pt-6">
        <div className="flex justify-end mb-8">
          <Link
            to="sessions"
            className="btn btn-outline btn-accent btn-md hover:!text-white"
            state={userData}
            onClick={(e) => {
              if (isLoading) e.preventDefault(); // Prevent navigation
            }}
          >
            {isLoading ? (
              <>
                <span className="loading loading-ring loading-md"></span>
                Loading...
              </>
            ) : (
              "Upcoming Sessions"
            )}
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
      </section>
    </div>
  );
};

export default Admin;
