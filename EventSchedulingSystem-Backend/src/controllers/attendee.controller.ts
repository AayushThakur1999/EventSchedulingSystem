import mongoose from "mongoose";
import { Attendee } from "../models/attendee.model.js";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/index.js";

export const addAttendee = AsyncHandler(async (req, res) => {
  const { username, schedule, eventName } = req.body;
  let { multipleAttendees } = req.body;

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

  if (!schedule.meetingStartTime || !schedule.meetingEndTime) {
    throw new ApiError(
      400,
      "Meeting date plus starting and ending times are required!"
    );
  }

  const sTime = new Date(schedule.meetingStartTime);
  const eTime = new Date(schedule.meetingEndTime);

  if (sTime >= eTime) {
    throw new ApiError(
      409,
      "Start time is either greater or equal to end time!"
    );
  }
  // console.log("Meeting StartTime::", schedule.meetingStartTime);
  // console.log("CUrrent date::", new Date());
  // console.log("type of meetingST::", typeof schedule.meetingStartTime)
  // console.log(
  //   "schedule.meetingStartTime < new Date()",
  //   schedule.meetingStartTime < new Date()
  // );
  if (sTime < new Date()) {
    throw new ApiError(
      409,
      "Meeting start date and time cannot be less than the current date and time"
    );
  }

  // console.log("sTime and type of sTime:::", sTime, typeof sTime);
  // console.log("eTime::", eTime);

  // checks and throws error if we are trying to add multiple attendees when they shouldn't be there
  const eventExists = await Attendee.findOne({ eventName });

  if (eventExists && eventExists.multipleAttendees === false) {
    throw new ApiError(409, "This event does not allow multiple attendees!");
  }

  /* condition to save multipleAttendee property as true for a pre-existing
  event (which allows multiple attendees) even if the admin forgets to mark 
  the multipleAttendees property as true to avoid discrepancies in future  
  while trying to find an existing event */
  if (
    eventExists &&
    eventExists.multipleAttendees === true &&
    multipleAttendees === false
  ) {
    multipleAttendees = true;
  }

  const duplicateAttendee = await Attendee.findOne({
    $and: [
      { username },
      { [`schedule.meetingStartTime`]: { $lt: eTime } },
      { [`schedule.meetingEndTime`]: { $gt: sTime } },
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

  const removedAvailabilities = await Attendee.deleteMany({
    username,
    "schedule.meetingEndTime": { $lte: new Date() },
  });

  const attendeeSessions = await Attendee.find({
    username,
  });
  // console.log("attendee Sessions:", attendeeSessions);

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
  // {
  //   _id: { $oid: "67600463dcfafb3b2c89d422" },
  //   username: "krishna",
  //   schedule: {
  //     "1/9/2025": {
  //       meetingStartTime: { $date: { $numberLong: "1736396100000" } },
  //       meetingEndTime: { $date: { $numberLong: "1736397900000" } },
  //     },
  //   },
  //   eventName: "salary discussion",
  //   multipleAttendees: false,
  //   createdAt: { $date: { $numberLong: "1734345827913" } },
  //   updatedAt: { $date: { $numberLong: "1734345827913" } },
  //   __v: { $numberInt: "0" },
  // };
  //

  // const currentDate = new Date();

  // Set current time to ignore time zone differences during comparison
  // const currentTime = new Date(currentDate.setMilliseconds(0));

  // To delete the above type of document we used this approach
  // const sessionsToDelete = await Attendee.aggregate([
  //   {
  //     $match: {
  //       schedule: { $exists: true, $not: { $size: 0 } },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       scheduleArray: { $objectToArray: "$schedule" }, // Convert `schedule` to array of { k, v }
  //     },
  //   },
  //   {
  //     $addFields: {
  //       filteredSchedule: {
  //         $filter: {
  //           input: "$scheduleArray", // Input: Array of { k, v }
  //           as: "item", // Variable for each array element
  //           cond: {
  //             $or: [
  //               {
  //                 // Check if the date part of meetingEndTime is equal to current date
  //                 $and: [
  //                   {
  //                     $eq: [
  //                       {
  //                         $dateToString: {
  //                           format: "%m/%d/%Y",
  //                           date: "$$item.v.meetingEndTime",
  //                         },
  //                       },
  //                       {
  //                         $dateToString: {
  //                           format: "%m/%d/%Y",
  //                           date: currentDate,
  //                         },
  //                       },
  //                     ],
  //                   },
  //                   {
  //                     // Check if meetingEndTime is less than current time
  //                     $lt: ["$$item.v.meetingEndTime", currentTime],
  //                   },
  //                 ],
  //               },
  //               {
  //                 // Check if the date key (schedule key) is less than the current date
  //                 $lt: [
  //                   {
  //                     $dateFromString: {
  //                       dateString: "$$item.k", // The schedule key (date)
  //                       format: "%m/%d/%Y",
  //                     },
  //                   },
  //                   {
  //                     $dateFromString: {
  //                       dateString: {
  //                         $dateToString: {
  //                           format: "%m/%d/%Y",
  //                           date: currentDate,
  //                         },
  //                       },
  //                       format: "%m/%d/%Y",
  //                     },
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $match: {
  //       "filteredSchedule.0": { $exists: true }, // Only keep documents with non-empty filteredSchedule
  //     },
  //   },
  //   {
  //     $project: {
  //       scheduleArray: 0, // Exclude intermediate fields from the result
  //       filteredSchedule: 0,
  //     },
  //   },
  // ]);

  // I got to the above approach using this
  // const sessionsToDelete = await Attendee.aggregate([
  //   {
  //     $match: {
  //       schedule: { $exists: true, $not: { $size: 0 } },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       scheduleArray: { $objectToArray: "$schedule" }, // Convert `schedule` to array of { k, v }
  //     },
  //   },
  //   {
  //     $addFields: {
  //       pastSchedule: {
  //         $filter: {
  //           input: "$scheduleArray", // Input: Array of { k, v }
  //           as: "item", // Variable for each array element
  //           cond: {
  //             $lt: [
  //               {
  //                 $dateFromString: {
  //                   dateString: "$$item.k",
  //                   format: "%m/%d/%Y", // Ensure comparison is only on the date part
  //                 },
  //               }, // Convert key (date string) to Date
  //               {
  //                 // Strip the time from currentDate by resetting it to midnight
  //                 $dateFromString: {
  //                   dateString: {
  //                     $dateToString: { format: "%m/%d/%Y", date: currentDate },
  //                   },
  //                   format: "%m/%d/%Y", // Format as MM/DD/YYYY to strip time
  //                 },
  //               }, // Compare with current date
  //             ],
  //           },
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $match: {
  //       "pastSchedule.0": { $exists: true }, // Only keep documents with non-empty pastSchedule
  //     },
  //   },
  //   {
  //     $project: {
  //       scheduleArray: 0, // Exclude intermediate fields from the result
  //       pastSchedule: 0,
  //     },
  //   },
  // ]);

  // console.log(
  //   "filtered documents which needs to be deleted::",
  //   sessionsToDelete.length
  // );

  // const idsToDelete = sessionsToDelete.map((session) => session._id);

  // // deleting expired sessions
  // await Attendee.deleteMany({ _id: { $in: idsToDelete } });

  // delete used-up/expired attendee/session docs
  // const deletedSessions = await Attendee.deleteMany({
  await Attendee.deleteMany({
    "schedule.meetingEndTime": { $lte: new Date() },
  });
  // console.log("deleted sessions data", deletedSessions);

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
  // console.log("attendeeId", attendeeId);

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
