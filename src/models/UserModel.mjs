import db from "../config/Database.mjs";

//search the email received in the database
export const findUserByEmailModel = async (email) => {
  //select all data from the user if the email is found
  const [rows] = await db.query("SELECT * FROM users usr  INNER JOIN user_details ud ON  usr.user_id = ud.user_id  WHERE usr.email = ? ", [email]);
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
  const connection = await db.getConnection(); //Obtain a manually connection

  try {
    await connection.beginTransaction(); //Start transaction

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

    //Insert user in 'users'
    const [rows] = await connection.query(
      "INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)",
      [email, password_hash, user_type]
    );

    const user_id = rows.insertId; //Obtain an ID of the inserted user

    //Insert details in 'User_details'
    await connection.query(
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

    await connection.commit(); //Confirm the transaction if everything went well
    connection.release(); //release the connection
    return { success: true, user_id };
  } catch (error) {
    await connection.rollback(); //reverse changes if there was error
    connection.release(); //release the connection
    throw error;
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
    throw error;
  }
};
export const updateUserDataModel = async (
  userData,
  userDetails,
  user_type,
  user_id
) => {
  const connection = await db.getConnection();//Obtain manually connection

  try {
    await connection.beginTransaction(); //Start transaction

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
    } = userDetails;

    // Update User in 'Users'
    await connection.query(
      "UPDATE users SET email = ?, user_type = ? WHERE user_id = ?",
      [email, user_type, user_id]
    );

  //Update details at 'User_Details'
    await connection.query(
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

    await connection.commit();//Confirm changes if everything went well
    connection.release();//release connection

    return { success: true, message: "Usuario actualizado correctamente" };
  } catch (error) {
    await connection.rollback(); // Reverse changes in case of error
    connection.release(); //Release connection after error
    throw error;
  }
};

export const deleteUserModel = async (id) => {
  try {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  } catch (error) {
    throw error;
  }
};

export const getEmployees = async (employees) => {
  //generates?,?,? According to the number of elements
  const placeholders = employees.map(() => "?").join(",");
  try {
    const [rows] = await db.query(
      `SELECT usr.user_id, usr.email, usr.user_type, ud.user_names, ud.last_names, ud.phone_number, ud.identification, ud.birth_date, ud.bank, ud.account_number, ud.type_identification, ud.employee_type FROM users usr INNER JOIN user_details ud ON usr.user_id = ud.user_id where ud.employee_type IN (${placeholders})`,
      employees
    );
    return rows;
  } catch (error) {
    throw error;
  }
};
