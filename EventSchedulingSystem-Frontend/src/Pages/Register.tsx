import { Form, Link, useNavigate } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
import { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullname || !password || !fullname || !email) {
      alert("Fill all form fields");
      return;
    }
    const registerData = {
      fullname,
      username,
      email,
      password,
    };
    console.log(registerData);
    toast.success("Registered Successfully!");
    navigate("/login");
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
          label="fullname"
          name="fullname"
          value={fullname}
          handleInputChange={setFullname}
        />
        <FormInput
          type="text"
          label="username"
          name="username"
          value={username}
          handleInputChange={setUsername}
        />
        <FormInput
          type="email"
          label="email"
          name="userEmail"
          value={email}
          handleInputChange={setEmail}
        />
        <FormInput
          type="password"
          label="password"
          name="userPassword"
          value={password}
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
