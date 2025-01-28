import db from "../config/Database.mjs";

//search the email received in the database
export const findUserByEmailModel = async (email) => {
  //select all data from the users table if the email is found
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  //return response from database
  return rows[0];
};

//search the user identification received in the database
export const findUserByIdentificationModel = async (identification) => {
  //select all data nested to the user ID
  const [rows] = await db.query(
    "SELECT * FROM users usr INNER JOIN user_details ud ON usr.user_id = ud.user_id WHERE ud.identification = ?",
    [identification]
  );
  //return response from database
  return rows[0];
};

export const registerUserModel = async (userData, userDetails) => {
  try {
    const { email, password_hash, user_type } = userData;
    const {
      user_names,
      last_names,
      phone_number,
      identification,
      birth_date,
      bank,
      account_number,
      type_identification,
      employee_type,
    } = userDetails;

    //insert new user
    const [rows] = await db.query(
      "INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)",
      [email, password_hash, user_type]
    );

    //Get the ID of the newly created user
    const user_id = rows.insertId;
    //Insert new user data
    await db.query(
      "INSERT INTO user_details (user_id, user_names, last_names, phone_number, identification, birth_date, bank, account_number, type_identification, employee_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        user_names,
        last_names,
        phone_number,
        identification,
        birth_date,
        bank,
        account_number,
        type_identification,
        employee_type,
      ]
    );
  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
    throw error; //Throw the error to handle it out of scope
  }
};

export const searchUsersModel = async (
  user_names,
  type_identification,
  identification
) => {
  try {
    //search the user by name, type of identification and identification
    const [rows] = await db.query(
      "SELECT usr.user_id, usr.email, usr.user_type, ud.user_names, ud.last_names, ud.phone_number, ud.identification, ud.birth_date, ud.bank, ud.account_number, ud.type_identification, ud.employee_type FROM users usr INNER JOIN user_details ud ON usr.user_id = ud.user_id WHERE user_names = ? AND type_identification = ? AND identification = ?",
      [user_names, type_identification, identification]
    );
    //return the user data
    return rows;
  } catch (error) {
    console.error("Error when looking for the user:", error.message);
    throw error;
  }
};

export const updateUserDataModel = async (userData, userDetails, user_type) => {
  try {
    const { email } = userData;
    const {
      user_names,
      last_names,
      phone_number,
      identification,
      birth_date,
      bank,
      account_number,
      type_identification,
      employee_type,
      user_id,
    } = userDetails;

    //update user data
    await db.query(
      "UPDATE users SET email = ?, user_type = ? WHERE user_id = ?",
      [email, user_type, user_id]
    );

    //update user details
    await db.query(
      "UPDATE user_details SET user_names = ?, last_names = ?, phone_number = ?, identification = ?, birth_date = ?, bank = ?, account_number = ?, type_identification = ?, employee_type = ? WHERE user_id = ?",
      [
        user_names,
        last_names,
        phone_number,
        identification,
        birth_date,
        bank,
        account_number,
        type_identification,
        employee_type,
        user_id,
      ]
    );
  } catch (error) {
    console.error("Error when updating the user:", error.message);
    throw error;
  }
};
export const deleteUserModel = async (id) => {
  try {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  } catch (error) {
    console.error("Error deleting the user:", error.message);
    throw error;
  }
};

export const getEmployees = async (employee_type) => {
  try {
    const [rows] = await db.query(
      "SELECT usr.user_id, usr.email, usr.user_type, ud.user_names, ud.last_names, ud.phone_number, ud.identification, ud.birth_date, ud.bank, ud.account_number, ud.type_identification, ud.employee_type FROM users usr INNER JOIN user_details ud ON usr.user_id = ud.user_id where ud.employee_type  = ?",
      [employee_type]
    );
    return rows;
  } catch (error) {
    console.log(
      "Error trying to look for employees in the database",
      error.emssage
    );
    throw error;
  }
};
