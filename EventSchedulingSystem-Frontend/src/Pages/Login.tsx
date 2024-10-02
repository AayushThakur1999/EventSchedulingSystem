import { Form, Link, useNavigate } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Are you an admin:", isAdmin);
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/user/1");
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        onSubmit={handleSubmit}
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
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
        <FormInput
          type="checkbox"
          label="Are you an admin?"
          name="admin"
          value={isAdmin}
          handleInputChange={setIsAdmin}
        />
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
