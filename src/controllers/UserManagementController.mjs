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
    //Map the employee type to user_type
    const roleMap = {
      Bartender: "employee",
      Mesero: "employee",
      Host: "employee",
      "Operario de limpieza": "employee",
      DJ: "employee",
      "Operario de seguridad": "employee",
      Administrador: "administrator",
      Gerente: "manager"
    };

    const userType = roleMap[userDetails.employee_type] || "";

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
  //Map the employee type to user_type
  const roleMap = {
    Bartender: "employee",
    Mesero: "employee",
    Host: "employee",
    "Operario de limpieza": "employee",
    DJ: "employee",
    "Operario de seguridad": "employee",
    Administrador: "administrator",
    Gerente: "manager"
  };

  const user_type = roleMap[userDetails.employee_type] || "";

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

  const workAreas = {
    seguridad: [
      "Operario de seguridad"
    ],
    administrador: ["Administrador"],
    limpieza: ["Operario de limpieza"],
    atencion: ["Bartender", "Mesero", "Host"],
    entretenimiento: ["DJ"],
  }

  const employees = workAreas[employee_type];

  try {
    const user = await getEmployees(employees);
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
