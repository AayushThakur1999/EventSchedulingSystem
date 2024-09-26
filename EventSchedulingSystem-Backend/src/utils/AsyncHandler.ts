import { NextFunction, Request, Response } from "express";
import { AsyncRequestHandler } from "../types/types";

const AsyncHandler = (requestHandler: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default AsyncHandler;

// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => {async () => {}}
// const asyncHandler = (fn) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }
