import { Schema, model } from "mongoose";
import { AttendeeModel, IAttendee, IAttendeeMethods, TimeSlot } from "../types/index.js";

const timeSlotSchema = new Schema<TimeSlot>(
  {
    meetingStartTime: {
      type: Date,
      required: true,
    },
    meetingEndTime: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const attendeeSchema = new Schema<IAttendee, AttendeeModel, IAttendeeMethods>(
  {
    username: {
      type: String,
      required: true,
    },
    schedule: {
      type: timeSlotSchema,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      lowercase: true,
    },
    multipleAttendees: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Attendee = model<IAttendee, AttendeeModel>(
  "Attendee",
  attendeeSchema
);
