import { cookieOptions } from "../constants";
import { User } from "../models/user.model";
import { TokensJwtPayload } from "../types";
import {
  ApiError,
  AsyncHandler,
  generateAccessAndRefreshTokens,
  ApiResponse,
} from "../utils";
import jwt from "jsonwebtoken";

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

export const loginUser = AsyncHandler(async (req, res) => {
  // Take input fields from user
  // Check if any field is empty
  // Find the user in the DB, if not found throw error
  // Check the case when user is admin
  // Compare the password to that in DB
  // If the details are correct create access and refresh tokens else throw an error
  // send cookies and response

  const { username, email, password, isAdmin } = req.body;

  if (!(username || email) || !password) {
    throw new ApiError(
      400,
      "Both username or email and password are required."
    );
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist :(");
  }

  if (isAdmin !== user.isAdmin && isAdmin === false) {
    throw new ApiError(404, "No such user exists!");
  }
  if (isAdmin !== user.isAdmin && isAdmin === true) {
    throw new ApiError(404, "No such admin exists!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged-in successfully!"
      )
    );
});

export const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged-out successfully!"));
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request :[");
  }

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(
      500,
      "ACCESS_TOKEN_SECRET is not defined in environment variables"
    );
  }
  const decodedToken = (await jwt.verify(
    incomingRefreshToken,
    secret
  )) as TokensJwtPayload;

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token :<");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user?._id);

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "access token refreshed :>"
      )
    );
});
