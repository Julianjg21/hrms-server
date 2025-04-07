import express from "express";
import {
  createNewEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/UserEventsController.mjs";
import verifyTokenAndPermisions from "../middlewares/VerifyUserAndPermissions.mjs";

const app = express.Router();

// Routes for user events
app.get("/getAllEvents/:userId",verifyTokenAndPermisions,  getAllEvents);
app.post("/newEvent", verifyTokenAndPermisions, createNewEvent);
app.put("/updateEvent",verifyTokenAndPermisions,  updateEvent);
app.delete("/deleteEvent/:idEvent",verifyTokenAndPermisions,  deleteEvent);

export default app;
