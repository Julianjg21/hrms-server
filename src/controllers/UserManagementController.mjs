import {
  registerUserModel,
  searchUsersModel,
  updateUserDataModel,
  deleteUserModel,
  getEmployees,
} from "../models/UserModel.mjs";
import * as Sentry from "@sentry/node";
import bcrypt from "bcrypt";
export const createUsersController = async (req, res) => {
  const { userData, userDetails } = req.body;
  try {
    let userType = "";
    //Check the user type
    switch (userDetails.employee_type) {
      case "Bartender":
      case "Mesero":
      case "Host":
      case "Operario de limpieza":
      case "DJ":
      case "Operario de seguridad":
        userType = "employee";
        break;
      case "Administrador":
        userType = "administrator";
        break;
      case "Gerente":
        userType = "manager";
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
    await registerUserModel(newUserData, userDetails);
    return res
      .status(201)
      .json({ message: "usuario registrado correctamente." });
  } catch (error) {
    //Error If duplicate data is found in Database
    if (error.code === "ER_DUP_ENTRY") {
      //Extract the duplicate field of the error message
      const match = error.sqlMessage.match(/for key '(.+?)'/);
      let field = "desconocido";
      if (match) {
        const keyName = match[1];
        if (keyName.includes("email")) field = "El correo electrónico";
        if (keyName.includes("account_number")) field = "El N.cuenta";
        if (keyName.includes("identification")) field = "la Identificación";
      }

      return res.status(400).json({
        message: `${field} se encuentra registrado en otro usuario.`,
        error: error.message,
      });
    }
    Sentry.captureException(error);
    res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};

export const searchUsersController = async (req, res) => {
  const { user_names, type_identification, identification } = req.query;
  try {
    const user = await searchUsersModel(
      user_names,
      type_identification,
      identification
    );
    res.status(200).json({ message: "Usuario encontrado", user });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      message: "Error al buscar el usuario",
      error: error.message,
    });
  }
};

export const editUserDataController = async (req, res) => {
  const { userData, userDetails } = req.body;
  const user_id = req.params.id;
  let user_type = "";
  //Check the user type
  switch (userDetails.employee_type) {
    case "Bartender":
    case "Mesero":
    case "Host":
    case "Operario de limpieza":
    case "DJ":
    case "Operario de seguridad":
      user_type = "employee";
      break;
    case "Administrador":
      user_type = "administrator";
      break;
    case "Gerente":
      user_type = "manager";
      break;
    default:
      break;
  }
  try {
    await updateUserDataModel(userData, userDetails, user_type, user_id);
    res.status(200).json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUserModel(id);
    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    Sentry.captureException(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

export const searchEmployeesController = async (req, res) => {
  const { employee_type } = req.query;
  try {
    const user = await getEmployees(employee_type);
    res.status(200).json({ message: "Usuarios encontrados", user });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      message: "Error al buscar el usuario",
      error: error.message,
    });
  }
};
export default createUsersController;
