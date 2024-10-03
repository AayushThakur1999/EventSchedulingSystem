import AsyncHandler from "../utils/AsyncHandler";

export const registerUser = AsyncHandler(async (req, res) => {
  // Step 1 Get data fields from user
  // Step 2 check whether data fields are empty
  // Step 3 check whether same user exists
  // Step 4 create user object - create entry in DBregister user's data in DB
  // Step 5 remove password and refreshToken fields from response
  // Step 6 Check for user's successful creation
  // Step 7 return response

  const { fullname, username, email, password } = req.body;
  console.log("Fullname:", fullname);
  res.status(200).json({ message: "Alrighty!" });
});
