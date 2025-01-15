import { Schema, model } from "mongoose";
import { User } from "./user.model.js";
import {
  AvailabilityModel,
  IAvailability,
  IAvailabilityMethods,
} from "../types/index.js";

const availabilitySchema = new Schema<
  IAvailability,
  AvailabilityModel,
  IAvailabilityMethods
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    startDateAndTime: {
      type: Date,
      required: true,
    },
    endDateAndTime: {
      type: Date,
      required: true,
    },
    // startDate: {
    //   type: String,
    //   required: true,
    // },
    // endDate: {
    //   type: String,
    //   required: true,
    // },
    // startTime: {
    //   type: String,
    //   required: true,
    // },
    // endTime: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

export const Availability = model<IAvailability, AvailabilityModel>(
  "Availability",
  availabilitySchema
);
