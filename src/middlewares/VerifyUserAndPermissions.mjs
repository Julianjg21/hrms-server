import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserPermissionModel } from "../models/RoleModel.mjs";

//set env variables
dotenv.config();

//verify tokens
export const verifyTokenAndPermisions = async (req, res, next) => {
  // Extract the token from the authorization header
  const token = req.headers.authorization?.split(" ")[1];
  const userId = req.headers["x-user-id"];//Extract User ID of the administrator from the Headers
  const permissionsHeader = req.headers["x-permissions"];//Extract permissions from the Headers
  const permissions = JSON.parse(permissionsHeader); //Convert String Type to Object Type

  //check if the token is missing
  if (!token || permissions.length === 0 || !userId) {
    return res
      .status(401)
      .json({ message: "No token provided or permissions" });
  }

  try {
    //verify the token and decode the date of the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign the `user_type` property from the decoded token to the `req` object
    req.user_type = decoded.user_type;
    //If the token is correct, send the access confirmation
    //get permissions from the user's role
    const UserPermissions = await findUserPermissionModel(userId);
    if (UserPermissions.length === 0) {
      return res.status(404).json({
        message: "No permissions found for the roles of this user",
      });
    }
    //check if the user has the required permissions
    const hasPermissions = permissions.every((str) =>
      UserPermissions.some((perm) => perm.permission === str)
    );
    if (!hasPermissions) {

      return res.json("Invalid permissions");
    }

    next();
  } catch (error) {
    //if the token is invalid, the error is sent to the client
    res.status(403).json({ message: "permissions or token are invalid" });
  }
};

export default verifyTokenAndPermisions;
