import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  EventAllotment,
  Login,
  Register,
  UserAvailability,
  Error,
  Landing,
  UserSessions,
} from "./Pages";
import {
  adminLoader,
  allSessionsLoader,
  loginAction,
  registerAction,
  registerLoader,
  userLoader,
  userSessionsLoader,
} from "./Utils";
import AllUsersSessions from "./Pages/AllUsersSessions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    path: "login",
    element: <Login />,
    action: loginAction,
    errorElement: <Error />,
  },
  {
    path: "/admin/:id/register",
    element: <Register />,
    loader: registerLoader,
    action: registerAction,
    errorElement: <Error />,
  },
  {
    path: "/admin/:id/sessions/register",
    element: <Register />,
    loader: registerLoader,
    action: registerAction,
    errorElement: <Error />,
  },
  {
    path: "user/:id",
    element: <UserAvailability />,
    loader: userLoader,
    errorElement: <Error />,
  },
  {
    path: "user/:id/my-sessions",
    element: <UserSessions />,
    loader: userSessionsLoader,
    errorElement: <Error />,
  },
  {
    path: "admin/:id",
    element: <Admin />,
    loader: adminLoader,
    errorElement: <Error />,
  },
  {
    path: "admin/:id/sessions",
    element: <AllUsersSessions />,
    loader: allSessionsLoader,
    errorElement: <Error />,
  },
  {
    path: "admin/:id/user/:userId",
    element: <EventAllotment />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
