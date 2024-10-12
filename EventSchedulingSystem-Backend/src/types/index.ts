import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, Model, Types } from "mongoose";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  refreshToken?: string;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Updated: Explicitly include _id in UserDocument
export interface UserDocument extends Document, IUser, IUserMethods {
  _id: Types.ObjectId;
}

// Updated: Change UserModel to interface and extend Model<UserDocument>
export interface UserModel extends Model<UserDocument> {
  // Add any static methods here if needed
  // For example:
  // findByEmail(email: string): Promise<UserDocument | null>;
}

// used as type for decoded Jwt token based on generateAccessToken method in userSchema
export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  username: string;
  fullname: string;
}
