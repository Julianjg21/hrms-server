import express from "express";
import {createUsersController, searchUsersController, editUserDataController, deleteUserController, searchEmployeesController} from "../controllers/UserManagementController.mjs";
import { verifyTokenAndPermisions } from "../middlewares/VerifyUserAndPermissions.mjs";
// Create a new Express router instance to define route handlers.
const router = express.Router();

router.post("/createUsers", verifyTokenAndPermisions, createUsersController);
router.post("/searchUsers", verifyTokenAndPermisions, searchUsersController);
router.post("/editUserData", verifyTokenAndPermisions, editUserDataController);
router.post("/deleteUser/:id", verifyTokenAndPermisions, deleteUserController);
router.post("/searchEmployees/", verifyTokenAndPermisions, searchEmployeesController);

export default router;
