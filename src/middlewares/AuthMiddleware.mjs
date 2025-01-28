import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//set env variables
dotenv.config();

//verify tokens
export const verifyTokenMiddleware = (req, res) => {
  // Extract the token from the authorization header
  //If the Authorization header is missing or improperly formatted, the token will be undefined
  const token = req.headers.authorization?.split(" ")[1];

  //check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    //verify the token and decode the date of the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign the `user_type` property from the decoded token to the `req` object
    req.user_type = decoded.user_type;
    //If the token is correct, send the access confirmation
    return res.status(200).json({ valid: true, message: "Token verified" });
  } catch (error) {
    //if the token is invalid, the error is sent to the client
    res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyTokenMiddleware;
