import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//extra security packages
import helmet from "helmet";
import xss from "xss-clean";
import { rateLimit } from "express-rate-limit";

const app = express();

// ensures that our api is accessible from different domain
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// used for parsing incoming JSON payloads in request bodies(req.body)
app.use(express.json({ limit: "16kb" }));

// sets various http headers to prevent numerous possible attacks
app.use(helmet());

// sanitizes the user input in req.body, req.params and req.query
app.use(xss());

// helps in limiting the amount of requests the user can make
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);

// Parses incoming URL-encoded payloads in request bodies(req.body)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// Used to get access to cookies and perform CRUD operations on cookies present on the user's browser
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import availabilityRouter from "./routes/availability.routes.js";
import attendeeRouter from "./routes/attendee.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/attendee", attendeeRouter);

export { app };
