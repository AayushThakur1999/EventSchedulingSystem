// import mongoose from "mongoose";
// import { DB_NAME } from "../constants";
// import { log } from "console";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${DB_NAME}`
//     );
//     log(
//       `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     log("MongoDB connection FAILED:", error);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { log } from "console";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    log("MongoDB connection FAILED:", error);
    process.exit(1);
  }
};

// Gracefully close the MongoDB connection when the application exits
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    log("Error closing MongoDB connection:", error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGINT", closeDB); // for Ctrl+C
process.on("SIGTERM", closeDB); // for other termination signals

export default connectDB;
