import { log } from "console";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      log("ERR:-", err);
      throw err;
    });
    app.listen(port, () => {
      log(`Server is running at port: ${port}...`);
    });
  })
  .catch((err) => {
    log("MongoDb connection failed !!!", err);
  });

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
