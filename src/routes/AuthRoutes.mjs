import express from "express";
import { loginUser } from "../controllers/AuthControllers.mjs";
import verifyToken from "../middlewares/AuthMiddleware.mjs";

// Create a new Express router instance to define route handlers.
const router = express.Router();

// Define a POST route at "/login" that calls the `loginUser` function to handle login requests.
router.post("/login", loginUser);

// Define a GET route at "/protected" that is protected by the `verifyToken` middleware.
// If the token is valid, the middleware allows access to the route.
router.get("/protected", verifyToken);

export default router;
