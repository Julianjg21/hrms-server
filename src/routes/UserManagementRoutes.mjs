import express from "express";
import {createUsersController, searchUsersController, editUserDataController, deleteUserController, searchEmployeesController} from "../controllers/UserManagementController.mjs";
import { verifyTokenAndPermisions } from "../middlewares/VerifyUserAndPermissions.mjs";
// Create a new Express router instance to define route handlers.
const router = express.Router();

router.post("/createUsers", verifyTokenAndPermisions, createUsersController);
router.get("/searchUsers", verifyTokenAndPermisions, searchUsersController);
router.put("/editUserData/:id", verifyTokenAndPermisions, editUserDataController);
router.delete("/deleteUser/:id", verifyTokenAndPermisions, deleteUserController);
router.get("/searchEmployees", verifyTokenAndPermisions, searchEmployeesController);

export default router;
