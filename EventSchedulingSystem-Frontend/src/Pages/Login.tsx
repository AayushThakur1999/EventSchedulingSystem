import { Form } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
import { useState } from "react";

const Login = () => {
  const [usernameLogin, setUsernameLogin] = useState(false);
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <div className="flex flex-col align-middle">
          {usernameLogin ? (
            <p className="text-center">Do you want to login using email?</p>
          ) : (
            <p className="text-center">Do you want to login using username?</p>
          )}
          <button
            type="button"
            className="mx-auto text-center text-base text-primary"
            onClick={() => setUsernameLogin((userLogin) => !userLogin)}
          >
            Click here
          </button>
        </div>
        {usernameLogin ? (
          <FormInput type="text" label="username" name="username" />
        ) : (
          <FormInput type="email" label="email" name="email" />
        )}
        <FormInput type="password" label="password" name="password" />
        <FormInput type="checkbox" label="Are you an admin?" name="isAdmin" />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>
      </Form>
    </section>
  );
};

export default Login;
