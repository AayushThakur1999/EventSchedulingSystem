import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  EventAllotment,
  Login,
  Register,
  UserAvailability,
} from "./Pages";
import { Error } from "./Pages";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "register",
    element: <Register />,
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
