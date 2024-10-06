import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import AsyncHandler from "../utils/AsyncHandler";

export const registerUser = AsyncHandler(async (req, res) => {
  // Step 1 Get data fields from user
  // Step 2 check whether data fields are empty
  // Step 3 check whether same user exists
  // Step 4 create user object - create entry in DBregister user's data in DB
  // Step 5 remove password field from response
  // Step 6 Check for user's successful creation
  // Step 7 return response

  // Step1
  const { fullname, username, email, password } = req.body;

  // Step 2
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Step 3
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists!");
  }

  // Step 4
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  // Step 5
  const createdUser = await User.findById(user._id).select("-password");

  // Step 6
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user :("
    );
  }

  // Step 7
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully!"));
});
