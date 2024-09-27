import { Form, Link } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        onSubmit={handleSubmit}
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput
          type="text"
          label="username"
          name="userName"
          defaultValue="John Doe"
          handleInputChange={setUsername}
        />
        <FormInput
          type="email"
          label="email"
          name="userEmail"
          defaultValue="test@test.com"
          handleInputChange={setEmail}
        />
        <FormInput
          type="password"
          label="password"
          name="userPassword"
          defaultValue="secret"
          handleInputChange={setPassword}
        />
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
