import db from "../config/Database.mjs";
//get permissions of the user
export const findUserPermissionModel = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM permissions p INNER JOIN role_permissions rp ON  rp.permission_id = p.id where rp.role_id IN (SELECT role_id from user_roles where user_roles.user_id =  ? )",
    [userId]
  );
  //return response from database
  return rows;
};

//get all permissions
export const getAllPermissionsModel = async () => {
  const [rows] = await db.query("SELECT * FROM permissions");
  //return data from database
  return rows;
};
