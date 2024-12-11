import express from "express";
import { findEmailController, verifyCodeController, resetPasswordController } from "../controllers/ResetPasswordController.mjs";
// Create a new Express router instance to define route handlers.
const router = express.Router();

// Define a POST route at "/login" that calls the `loginUser` function to handle login requests.
router.post("/findEmail", findEmailController);
router.post("/verifyCode", verifyCodeController);
router.post("/resetPassword", resetPasswordController);

export default router;
