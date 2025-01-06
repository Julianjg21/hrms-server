import { registerUser } from "../models/UserModel.mjs";
import bcrypt from "bcrypt";
export const createUsers = async (req, res) => {
  const { userData, userDetails } = req.body;
  try {
    let userType = "";
    //Check the user type
    switch (userDetails.employeeType) {
      case "Bartender":
      case "Mesero":
      case "Host":
      case "Operario de limpieza":
      case "DJ":
      case "Operario de seguridad":
        userType = "Employee";
        break;
      case "Administrador":
        userType = "administrator";
        break;
      case "Gerente":
        userType = "Manager";
        break;
      default:
        break;
    }

    //Generate hash of the password
    const hash = await bcrypt.hash(userData.identification, 10);
    const passwordHash = hash;
    const newUserData = {
      email: userData.email,
      password_hash: passwordHash,
      user_type: userType,
    };
    //Register the user
    await registerUser(newUserData, userDetails);
    return res
      .status(200)
      .json({ message: "usuario registrado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};
export default createUsers;
