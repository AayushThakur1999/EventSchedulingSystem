import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addAttendee, getEventNames } from "../controllers/attendee.controller";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all the routes in this file

router.route("/add-attendee").post(addAttendee);
router.route("/eventNames").get(getEventNames);

export default router;