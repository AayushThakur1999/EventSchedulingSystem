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

  const duplicateAttendee = await Attendee.findOne({
    $and: [
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
