import express from "express";
import { loginUserController, verifyUserPasswordController } from "../controllers/AuthControllers.mjs";
import verifyTokenMiddleware from "../middlewares/AuthMiddleware.mjs";
import {verifyTokenAndPermisions} from "../middlewares/VerifyUserAndPermissions.mjs";
// Create a new Express router instance to define route handlers.
const router = express.Router();

// Define a POST route at "/login" that calls the `loginUser` function to handle login requests.
router.post("/login", loginUserController);

// Define a GET route at "/protected" that is protected by the `verifyToken` middleware.
// If the token is valid, the middleware allows access to the route.
router.get("/protected", verifyTokenMiddleware);
router.post("/verifyUserPassword", verifyTokenAndPermisions, verifyUserPasswordController);

export default router;
