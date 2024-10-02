import { Schema, model } from "mongoose";

const timeSlotSchema = new Schema({
  meetingStartTime: {
    type: String,
    required: true,
  },
  meetingEndTime: {
    type: String,
    required: true,
  },
});

const attendeeSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    schedule: {
      type: Map,
      of: timeSlotSchema, // Each date will map to a timeslot object
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

export const Attendee = model("Attendee", attendeeSchema);
