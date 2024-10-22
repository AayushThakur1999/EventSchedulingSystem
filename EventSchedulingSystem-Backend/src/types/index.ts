import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, Model, Types } from "mongoose";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export interface IUser extends Document<Types.ObjectId> {
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

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface LoginRequestBody {
  username?: string;
  email?: string;
  password: string;
  isAdmin?: boolean;
}

/**
 * Used as type for decoded Jwt token based on generateAccessToken method
 * and generateRefreshToken method where the latter only uses _id as payload
 * and the former uses all 4 properties 
 **/
export interface TokensJwtPayload extends JwtPayload {
  _id: string;
  email?: string;
  username?: string;
  fullname?: string;
}
