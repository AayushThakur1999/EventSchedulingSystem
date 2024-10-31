import { useRouteError } from "react-router-dom";

const Error = () => {
  const { message } = useRouteError() as Error;

  return (
    <div className="h-screen grid place-items-center p-20">
      <h1 className="text-5xl text-primary">
        {message || "Something went wrong..."}
      </h1>
    </div>
  );
};
export default Error;
