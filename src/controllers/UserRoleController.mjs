import { findUserPermissionModel, getAllPermissionsModel } from "../models/RoleModel.mjs";
export const getUserRoleController = async (req, res) => {
  const { roleId } = req.params;
  try {
//Find the permissions of a role
    const permissions = await findUserPermissionModel(roleId);
    if (permissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron permisos para este rol" });
    }

    res.status(200).json(permissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener permisos", error: error.message });
  }
};
//Get all permissions
export const getAllPermissionsControllers = async (req, res) => {
  try {
    const allPermissions = await getAllPermissionsModel();
    res.status(200).json(allPermissions);
    if (allPermissions.length === 0) {
      return res.status(404).json({ message: "No se encontraron permisos" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener permisos", error: error.message });
  }
};

export default getUserRoleController;
