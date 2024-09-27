import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, Register } from "./Pages";
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
