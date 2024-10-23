import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  EventAllotment,
  Login,
  Register,
  UserAvailability,
  Error,
  Landing
} from "./Pages";
import { loginAction, registerAction, userLoader } from "./Utils";

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
    path: "register",
    element: <Register />,
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
    path: "admin/:id",
    element: <Admin />,
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
