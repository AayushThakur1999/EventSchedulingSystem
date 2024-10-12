import { Form, Link, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const isAdmin = formData.has("isAdmin");
  const loginData = { ...data, isAdmin };
  console.log(loginData);
  try {
    const response = await axios.post("/users/login", loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    toast(response.data?.message || "You have logged-in successfully :)");
    if (response.data.data.user.isAdmin) {
      return redirect("/admin");
    } else {
      return redirect("/user/1");
    }
  } catch (error) {
    console.error("Error::", error);
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
};

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
        <p className="text-center">
          Not registered yet?
          <Link to="/register" className="ml-2 link link-hover link-primary">
            Register
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Login;
