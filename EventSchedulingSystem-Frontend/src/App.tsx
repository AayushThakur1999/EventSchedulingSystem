import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  EventAllotment,
  Login,
  Register,
  UserAvailability,
} from "./Pages";
import { Error } from "./Pages";
import { action as registerAction } from "./Pages/Register";
import { action as loginAction } from "./Pages/Login";

const router = createBrowserRouter([
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
    errorElement: <Error />,
  },
  {
    path: "admin",
    element: <Admin />,
    errorElement: <Error />,
  },
  {
    path: "admin/user/:id",
    element: <EventAllotment />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
