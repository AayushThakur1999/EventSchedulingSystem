import axios from "axios";
import { Params } from "react-router-dom";

export const userLoader = async ({ params }: { params: Params }) => {
  try {
    const response = await axios("/users/current-user");
    const user = response.data.data;
    if (user._id === params.id) {
      return user;
    }
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
