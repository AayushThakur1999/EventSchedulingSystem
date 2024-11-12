import mongoose from "mongoose";
import { Attendee } from "../models/attendee.model";
import { ApiError, ApiResponse, AsyncHandler } from "../utils";

export const addAttendee = AsyncHandler(async (req, res) => {
  const { username, schedule, eventName, multipleAttendees } = req.body;

  if (
    [username, schedule, eventName, multipleAttendees].some(
      // We are using loose equality here because null == undefined is true
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(
      400,
      "All fields are required for adding attendee to an event!!"
    );
  }

  Object.keys(schedule).forEach((key) => {
    if (
      !key ||
      !schedule[key].meetingStartTime ||
      !schedule[key].meetingEndTime
    ) {
      throw new ApiError(
        400,
        "Meeting date and starting and ending times are required!"
      );
    }

    if (schedule[key].meetingStartTime >= schedule[key].meetingEndTime) {
      throw new ApiError(
        409,
        "Start time is either greater or equal to end time!"
      );
    }
  });

  const [scheduledDate] = Object.keys(schedule);

  // console.log("Schedule-----", schedule);

  // console.log("ScheduledDate", scheduledDate);

  const sTime = schedule[scheduledDate]?.meetingStartTime;
  const eTime = schedule[scheduledDate]?.meetingEndTime;

  // console.log("sTime::", sTime);
  // console.log("eTime::", eTime);

  // checks and throws error if we are trying to add multiple attendees when they shouldn't be there
  const eventExists = await Attendee.findOne({ eventName });

  if (eventExists && eventExists.multipleAttendees === false) {
    throw new ApiError(409, "This event doesn not allow multiple attendees!");
  }

  const duplicateAttendee = await Attendee.findOne({
    $and: [
      { username },
      { [`schedule.${scheduledDate}`]: { $exists: true } },
      { [`schedule.${scheduledDate}.meetingStartTime`]: { $lt: eTime } },
      { [`schedule.${scheduledDate}.meetingEndTime`]: { $gt: sTime } },
    ],
  });

  if (duplicateAttendee) {
    throw new ApiError(
      409,
      "The timings provided by you are reserved for another event!"
    );
  }

  const attendee = await Attendee.create({
    username,
    schedule,
    eventName,
    multipleAttendees,
  });

  if (!attendee) {
    throw new ApiError(
      500,
      "Some went wrong while adding attendee to the event!"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        attendee,
        "Attendee added to the meeting successfully!"
      )
    );
});

export const getEventNames = AsyncHandler(async (req, res) => {
  const query = req.query.q;

  /**
   * The $match stage filters documents based on the case-insensitive search for eventName.
   * The $group stage groups the documents by the eventName field, ensuring each event name appears only once.
   * The $limit stage limits the results to 5 documents.
   * The $project stage reshapes the documents to include only the eventName field in the output.
   * This will ensure that the response contains unique event names without any repetitions.
   */
  const similarEventNames = await Attendee.aggregate([
    {
      $match: {
        eventName: { $regex: query, $options: "i" }, // Case-insensitive search
      },
    },
    {
      $group: {
        _id: "$eventName",
      },
    },
    {
      $limit: 5, // Limit results if needed
    },
    {
      $project: {
        _id: 0,
        eventName: "$_id",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, similarEventNames, "Successfully fetched eventNames")
    );
});

export const getAttendeeSessions = AsyncHandler(async (req, res) => {
  const { username } = req.user;

  // remove any attendee document where meeting End time is less than
  // the current time as it is useless at the current point in time
  const removedAvailabilities = await Attendee.deleteMany({
    username,
    $expr: {
      $lt: [
        {
          $min: {
            $map: {
              input: { $objectToArray: "$schedule" },
              as: "sched",
              in: "$$sched.v.meetingEndTime",
            },
          },
        },
        new Date(),
      ],
    },
  });

  const attendeeSessions = await Attendee.find({
    username,
  });

  if (!attendeeSessions) {
    throw new ApiError(
      500,
      "Something went wrong while fetching attendee's meeting list."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        attendeeSessions,
        "Session list fetched successfully!"
      )
    );
});

export const getAllAttendeeSessions = AsyncHandler(async (req, res) => {
  const attendeeSessions = await Attendee.find({});

  if (!attendeeSessions) {
    throw new ApiError(
      500,
      "Something went wrong while fetching total attendee's list."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        attendeeSessions,
        "Session list fetched successfully!"
      )
    );
});

export const removeAttendee = AsyncHandler(async (req, res) => {
  const { attendeeId } = req.params;
  console.log("attendeeId", attendeeId);

  if (!mongoose.isObjectIdOrHexString(attendeeId)) {
    throw new ApiError(400, "Invalid attendee ID!");
  }

  const removedAttendee = await Attendee.deleteOne({ _id: attendeeId });

  if (removedAttendee.deletedCount === 0) {
    throw new ApiError(400, "No attendee with such id exists!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, removedAttendee, "attendee deleted successfully")
    );
});
