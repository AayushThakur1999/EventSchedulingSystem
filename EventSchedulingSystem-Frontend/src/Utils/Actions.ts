import { AxiosError } from "axios";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Config/axios.config";

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const isAdmin = formData.has("isAdmin");
  const loginData = { ...data, isAdmin };
  console.log(loginData);
  try {
    const response = await api.post("/users/login", loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    const userData = response.data.data.user;
    toast(response.data?.message || "You have logged-in successfully :)");
    if (userData.isAdmin) {
      return redirect(`/admin/${userData._id}`);
    } else {
      return redirect(`/user/${userData._id}`);
    }
  } catch (error) {
    console.error("Error::", error);
    if (error instanceof AxiosError) {
      if (error.status === 401) {
        toast.error("Incorrect credentials!");
        throw new Error(error.message);
      }
      if (error.status === 404) {
        toast.error("No such user was found!");
        throw new Error(
          "User with these specific credentials does not exist!!"
        );
      }
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong while logging-in the user");
  }
};

export const registerAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    const response = await api.post("/users/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Success Response:", response);
    toast("Successfully registered!! ");
    return redirect("/login");
  } catch (error) {
    console.error("ERROR:--", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong while registering the user");
    }
  }
};
