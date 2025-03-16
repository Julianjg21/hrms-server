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
    throw error;
  }
};

export const getDocumentsModel = async (user_id) => {
  try {
    //Obtain database files
    const files = await db.query(
      "SELECT id, document_type, file_name, file_type, user_id FROM user_documents WHERE user_id = ?",
      [user_id]
    );
    return files;
  } catch (error) {
    throw error;
  }
};

export const downloadUserDocumentModel = async (documentId) => {
  try {
    //Request the File to the database
    const rows = await db.query(
      "SELECT file_name, file_type, file_data FROM user_documents WHERE id = ?",
      [documentId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

//Save the PDF in the database
export const savePayrollPdfModel = async (user_id, pdfData) => {
  const { file_name, buffer, payrollExtractDate } = pdfData;
  try {
    await db.query(
      "INSERT INTO payroll_statements (file_name,file_data, user_id, payroll_extract_date) VALUES (?, ?, ?,?)",
      [file_name, buffer, user_id, payrollExtractDate]
    );
  } catch (error) {
    throw error;
  }
};

export const getUserPayrollExtractsModel = async (user_id) => {
  try {
    //Obtain database files
    const files = await db.query(
      "SELECT id, file_name,  user_id , payroll_extract_date FROM payroll_statements WHERE user_id = ?",
      [user_id]
    );
    return files[0];
  } catch (error) {
    throw error;
  }
};

export const downloadUserPayrollExtractsModel = async (payrollExtractId) => {
  try {
    //Request the File to the database
    const rows = await db.query(
      "SELECT file_name,  file_data FROM payroll_statements WHERE id = ?",
      [payrollExtractId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};
