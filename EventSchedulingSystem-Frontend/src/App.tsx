import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Pages";
import { Error } from "./Pages";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
