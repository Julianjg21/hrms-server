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

export const registerUser = async (userData, userDetails) => {
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
      type_identification
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
      "INSERT INTO user_details (user_id, user_names, last_names, phone_number, identification, birth_date, bank, account_number, type_identification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        user_names,
        last_names,
        phone_number,
        identification,
        birth_date,
        bank,
        account_number,
        type_identification
      ]
    );

    console.log("Usuario y detalles insertados correctamente.");
  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
    throw error; //Throw the error to handle it out of scope
  }
};
