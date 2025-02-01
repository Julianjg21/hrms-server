import db from "../config/Database.mjs";

export const uploadFilesModel = async (
  document_type,
  originalname,
  mimetype,
  buffer,
  user_id
) => {
  try {
    const [findDocumentsSaved] = await db.query(
      "SELECT * FROM user_documents WHERE user_id = ? AND document_type = ?",
      [user_id, document_type]
    );

    if (findDocumentsSaved.length > 0) {
   //If it already exists, update the document
      await db.query(
        "UPDATE user_documents SET file_name = ?, file_type = ?, file_data = ? WHERE user_id = ? AND document_type = ?",
        [originalname, mimetype, buffer, user_id, document_type]
      );
    } else {
     //If it does not exist, insert a new record
      await db.query(
        "INSERT INTO user_documents (document_type, file_name, file_type, file_data, user_id) VALUES (?, ?, ?, ?, ?)",
        [document_type, originalname, mimetype, buffer, user_id]
      );
    }
  } catch (error) {
    console.log("Error al subir el archivo", error);
    throw error;
  }
};

export const getFilesModel = async (user_id) => {
  try {
//Obtain database files
    const files = await db.query(
      "SELECT id, document_type, file_name, file_type, user_id FROM user_documents WHERE user_id = ?",
      [user_id]
    );
    return files;
  } catch (error) {
    console.log("Error obtaining files", error);
    throw error;
  }
};

export const downloadUserDocumentModel = async (id) => {
  try {
//Request the File to the database
    const rows = await db.query(
      "SELECT file_name, file_type, file_data FROM user_documents WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error when downloading the file in the Model:", error);
    throw new Error("");
  }
};
