import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addAttendee } from "../controllers/attendee.controller";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all the routes in this file

router.route("/add-attendee").post(addAttendee);

export default router;
