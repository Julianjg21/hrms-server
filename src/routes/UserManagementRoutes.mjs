import express from "express";
import createUsers from "../controllers/UserManagementController.mjs";
import { verifyTokenAndPermisions } from "../middlewares/VerifyUserAndPermissions.mjs";
// Create a new Express router instance to define route handlers.
const router = express.Router();

router.post("/createUsers", verifyTokenAndPermisions, createUsers);

export default router;
