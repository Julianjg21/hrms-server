import {
  findUserByEmailModel,
  findUserByIdentificationModel,
} from "../models/UserModel.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { findUserPermissionModel } from "../models/RoleModel.mjs";
dotenv.config();

//verify keys and create access token
export const loginUserController = async (req, res) => {
  //extract data sent by the client
  const { identification, email, password, typeUser } = req.body;
  //verify the existence of the data received
  if ((!email, !password, !typeUser)) {
    return res
      .status(400)
      .json({ message: "complete information is required" });
  }

  //Verify keys according to the type of user to enter
  switch (typeUser) {
    //search user by email in the database
    case "administrator":
    case "manager":
      try {
        //search for user by email in the database
        const findByEmail = await findUserByEmailModel(email);
        if (!findByEmail) {
          return res.status(404).json({ message: "User not found" });
        }
        //verify that the password entered in the client matches the password registered in the database
        const isMatch = await bcrypt.compare(
          password,
          findByEmail.password_hash
        );

        //respond error message to the client if the passwords do not match and terminate the function process

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        //Create access token
        const token = jwt.sign(
          {
            user_id: findByEmail.user_id,
            email: findByEmail.email,
            user_type: findByEmail.user_type,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        //get permissions from the user's role
        const permissions = await findUserPermissionModel(findByEmail.user_id);
        if (permissions.length === 0) {
          return res.status(404).json({
            message: "No permissions found for this  role of the user",
          });
        }
        //send token to client
        res.json({
          token,
          permissions,
          userId: findByEmail.user_id,
          email: findByEmail.email,
        });
      } catch (error) {
        //if an error occurs in the function process, it will be sent as a response to the client
        res.status(500).json({ message: "Server error", error: error.message });
      }
      break;
    //search user by identification in the database
    case "employee":
      try {
        //search for user by  identification in the database
        const findByIdentification = await findUserByIdentificationModel(
          identification
        );

        if (!findByIdentification) {
          return res.status(404).json({ message: "User not found" });
        }

        //verify that the password entered in the client matches the password registered in the database
        const isMatch = await bcrypt.compare(
          password,
          findByIdentification.password_hash
        );
        //respond error message to the client if the passwords do not match and terminate the function process

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        //Create access token
        const token = jwt.sign(
          {
            user_id: findByIdentification.user_id, //user id
            identification: findByIdentification.identification, //user identification
            user_type: findByIdentification.user_type, //user type
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        //get permissions from the user's role
        const permissions = await findUserPermissionModel(
          findByIdentification.user_id
        );
        if (permissions.length === 0) {
          return res.status(404).json({
            message: "No permissions found for this  role of the user",
          });
        }

        //send token to client
        res.json({ token, permissions, userId: findByIdentification.user_id });
      } catch (error) {
        //if an error occurs in the function process, it will be sent as a response to the client
        res.status(500).json({ message: "Server error", error: error.message });
      }
      break;
  }
};

export const verifyUserPasswordController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  // Validar que se reciban los campos necesarios
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    //Search the user by email
    const user = await findUserByEmailModel(email);
    if (!user) {
      //Do not reveal whether the user exists or not
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Verify the password entered with the one registered in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      //Incorrect password
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //If everything is fine, respond successfully
    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error during password verification:", error.message);
    return res.status(500).json({
      message: "Error validating the password",
      error: error.message,
    });
  }
};

export default loginUserController;
