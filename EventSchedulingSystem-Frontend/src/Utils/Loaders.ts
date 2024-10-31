import { Params } from "react-router-dom";
import api from "../Config/axios.config";
import { adminLoaderData, userLoaderData } from "../Types";
import { toast } from "react-toastify";

export const registerLoader = async ({ params }: { params: Params }) => {
  try {
    const response = await api.get("/users/current-user");
    console.log("admin current data", response);

    const user = response.data.data;
    if (user._id === params.id) {
      if (user.isAdmin) {
        return toast.success("Authentication Successful, Welcome Admin 🦄");
      }
      toast.error("Only Admins have this privilege :[");
      throw new Error("Only Admins have the authority to register new users :)");
    }
    toast.error("Unauthorized user");
    throw new Error(`User with id:${params.id} is UNAUTHORIZED!`);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong while going to user");
  }
};

export const userLoader = async ({ params }: { params: Params }) => {
  try {
    const response = await api.get("/users/current-user");
    const user = response.data.data;
    const data: Partial<userLoaderData> = {};
    if (user._id === params.id) {
      data.userData = user;
      const availabilitiesResponse = await api.get(
        `/availability/getUserAvailabilities/${user._id}`
      );
      const availabilityList = availabilitiesResponse.data.data;
      data.userAvailabilities = availabilityList;
      return data;
    }
    toast.error("Unauthorized user");
    throw new Error(`User with id:${params.id} is UNAUTHORIZED!`);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong while fetching user");
    }
  }
};

export const adminLoader = async ({ params }: { params: Params }) => {
  try {
    const response = await api.get("/users/current-user");
    console.log("admin current data", response);

    const user = response.data.data;
    const data: Partial<adminLoaderData> = {};
    if (user._id === params.id) {
      data.userData = user;
      const availabilitiesResponse = await api.get(
        "/availability/getAllUserAvailabilities"
      );
      const availabilityList = availabilitiesResponse.data.data;
      data.allUsersAvailabilities = availabilityList;
      return data;
    }
    toast.error("Unauthorized user");
    throw new Error(`User with id:${params.id} is UNAUTHORIZED!`);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong while fetching user");
    }
  }
};
