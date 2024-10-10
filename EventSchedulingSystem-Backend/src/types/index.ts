import { NextFunction, Request, Response } from "express";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

import { Document, Model } from "mongoose";

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

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface UserDocument extends Document, IUser, IUserMethods {}
