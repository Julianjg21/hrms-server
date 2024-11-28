import db from "../config/Database.mjs";

//search the email received in the database
export const findUserByEmail = async (email) => {
  //select all data from the users table if the email is found
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//return response from database
  return rows[0];
  };

  //search the user identification received in the database
export const findUserByIdentification = async (identification) => {
 //select all data nested to the user ID
  const [rows] = await db.query(
    "SELECT * FROM users usr INNER JOIN user_details ud ON usr.user_id = ud.user_id WHERE ud.identification = ?",
    [identification]
  );
  //return response from database
  return rows[0];
};
