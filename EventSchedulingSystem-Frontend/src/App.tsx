import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Admin, Login, Register, User } from "./Pages";
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
    element: <User />,
    errorElement: <Error />,
  },
  {
    path: "admin",
    element: <Admin />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
