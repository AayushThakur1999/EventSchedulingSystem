import { Form, Link, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../Components";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const isAdmin = formData.has("isAdmin");
  const loginData = { ...data, isAdmin };
  console.log(loginData);
  if (loginData.isAdmin) {
    return redirect("/admin");
  } else {
    return redirect("/user/1");
  }
};

const Login = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput type="email" label="email" name="emal" />
        <FormInput type="password" label="password" name="password" />
        <FormInput
          type="checkbox"
          label="Are you an admin?"
          name="isAdmin"
          defaultValue={false}
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
