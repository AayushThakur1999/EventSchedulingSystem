import { Schema, model } from "mongoose";

const availabilitySchema = new Schema(
  {
    startDateAndTime: {
      type: Date,
      required: true,
    },
    endDateAndTime: {
      type: Date,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Availability = model("Availability", availabilitySchema);
