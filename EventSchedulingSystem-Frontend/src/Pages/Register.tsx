import { Form, Link, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";

import { toast } from "react-toastify";
import axios from "axios";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    const response = await axios.post("/users/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Success Response:", response);
    toast("Successfully registered!! ");
    return redirect("/login");
  } catch (error) {
    console.error("ERROR:--", error);
  }
};

//Warning: Because you're using action above so don't use action attribute in Form component
const Register = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput type="text" label="fullname" name="fullname" />
        <FormInput type="text" label="username" name="username" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />
        <div className="mt-4">
          <SubmitBtn text="register" />
        </div>
        <p className="text-center">
          Already a member?
          <Link to="/login" className="ml-2 link link-hover link-primary">
            Login
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Register;
