import {
  findUserByEmailModel,
  findUserByIdentificationModel,
} from "../models/UserModel.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { findUserPermissionModel } from "../models/RoleModel.mjs";
dotenv.config();

// Function to handle user authentication based on type
export const loginUserController = async (req, res) => {
  const { identification, email, password, typeUser } = req.body;

  // Validate that required fields are present
  if (!password || !typeUser || (!email && !identification)) {
    return res
      .status(400)
      .json({ message: "Complete information is required" });
  }

  try {
    let user;

    // Determine search method based on user type
    if (typeUser === "administrator" || typeUser === "manager") {
      user = await findUserByEmailModel(email);
    } else if (typeUser === "employee") {
      user = await findUserByIdentificationModel(identification);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // If user is not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the entered password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        identification: user.identification,
        user_type: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Fetch user permissions based on role
    const permissions = await findUserPermissionModel(user.user_id);
    if (permissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No permissions found for this user role" });
    }

    // Send successful authentication response
    res.json({
      token,
      permissions,
      userId: user.user_id,
      email: user.email,
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to verify user password for authentication
export const verifyUserPasswordController = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Search for the user by email
    const user = await findUserByEmailModel(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Respond with success message
    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    Sentry.captureException(error);
    return res
      .status(500)
      .json({ message: "Error validating the password", error: error.message });
  }
};

export default loginUserController;
