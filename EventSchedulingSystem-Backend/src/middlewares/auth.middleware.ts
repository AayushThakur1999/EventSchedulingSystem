import { User } from "../models/user.model";
import { TokensJwtPayload } from "../types";
import { ApiError, AsyncHandler } from "../utils";
import jwt from "jsonwebtoken";

// We can use _ in place of res since we are not using res in this function
export const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request !!");
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(
        500,
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
    const decodedToken = jwt.verify(token, secret) as TokensJwtPayload;

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || "Invalid access token");
    } else {
      throw new ApiError(401, "Invalid access token");
    }
  }
});
