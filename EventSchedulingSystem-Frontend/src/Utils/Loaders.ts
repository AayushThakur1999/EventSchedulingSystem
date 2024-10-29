import { Params } from "react-router-dom";
import api from "../Config/axios.config";
import { userLoaderData } from "../Types";
import { toast } from "react-toastify";

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
    toast.error("Unauthorized user")
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
