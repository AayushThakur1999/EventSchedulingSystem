import { Availability } from "../models/availability.model";
import { ApiError, ApiResponse, AsyncHandler } from "../utils";

export const addAvailability = AsyncHandler(async (req, res) => {
  // get availability data from user, passed in req.body
  // check that startDateAndTime does not precede the current date and time
  // check that the endDateAndTime is not smaller than startDateAndTime
  // check if the starting and ending date and time doesn't overlaps with another date and time
  // create availability object's entry in the DB
  // check for availability object's successful creation
  // return response
  const { userId, startDateAndTime, endDateAndTime } = req.body;
  const [startDnT, endDnT] = [
    new Date(startDateAndTime),
    new Date(endDateAndTime),
  ];
  // console.log("START AND END DnT", startDnT, endDnT);

  if (
    [userId, startDateAndTime, endDateAndTime].some(
      // We are using loose equality here because null == undefined is true
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All 3 fields are required!!");
  }

  // making sure that startDateAndTime is always less than endDateAndTime
  // console.log("********", startDnT >= endDnT);
  // console.log(typeof startDnT);

  if (startDnT < new Date()) {
    throw new ApiError(
      400,
      "Scheduled start date and time shouldn't precede the current date and time!"
    );
  }

  if (startDnT >= endDnT) {
    throw new ApiError(
      400,
      "Provided start date is equal to or bigger than the provided end date !"
    );
  }

  // checking for overlapping date and time values
  // IN OTHER WORDS
  // checking whether the date object is available or not

  const overlappingAvailability = await Availability.find({
    userId,
    // checks for events :
    // - where both startDateAndTime and endDateAndTime fall on or bt/w starting d&t(date and time) and ending d&t respectively.
    // - where startDateAndTime occurs before starting d&t and endDateAndTime occurs before ending d&t
    // - where startDateAndTime occurs after starting d&t and endDateAndTime occurs after ending d&t
    // - where startDateAndTime occurs before starting d&t and endDateAndTime occurs after ending d&t
    startDateAndTime: { $lt: endDnT },
    endDateAndTime: { $gt: startDnT },
  });

  if (overlappingAvailability.length) {
    throw new ApiError(
      409,
      "Your new availability is conflicting with the already present schedule!!"
    );
  }

  /* we can give startDnT and endDnT values to startDateAndTime and endDateAndTime respectively
  but we are not giving those values since mongoose is using our schema defintion to 
  create availability document */
  const createdAvailability = await Availability.create({
    userId,
    startDateAndTime,
    endDateAndTime,
  });

  if (!createdAvailability) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user :("
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdAvailability,
        "User availability added successfully!"
      )
    );
});

export const getUserAvailabilities = AsyncHandler(async (req, res) => {
  // get userId from parameters
  // check whether userId exists
  // remove availability documents whose endD&T(date and time) is less than currentD&T i.e., useless documents
  // find the documents having the userId equal to the userId got from params
  // return any documents found
  const { userId } = req.params;
  if (!userId.trim()) {
    throw new ApiError(400, "userId is missing!");
  }

  // remove used-up/useless documents if any (step 3)
  const removedAvailabilities = await Availability.deleteMany({
    userId,
    endDateAndTime: { $lt: new Date() },
  });
  console.log(removedAvailabilities);

  const availabilityList = await Availability.find({ userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        availabilityList,
        "Fetched user availabilities successfully :)"
      )
    );
});
