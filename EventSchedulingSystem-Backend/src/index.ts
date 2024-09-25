import connectDB from "./db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

/* import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
import { log } from "console";
import dotenv from "dotenv";
dotenv.config();

const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      log("ERR:", error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      log(`App is listening on port ${process.env.PORT || 3000}...`);
    });
  } catch (error) {
    console.error("ErroR:", error);
    throw error;
  }
})(); */
