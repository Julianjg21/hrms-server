import {
  uploadFilesModel,
  getDocumentsModel,
  downloadUserDocumentModel,
  savePayrollPdfModel,
  getUserPayrollExtractsModel,
  downloadUserPayrollExtractsModel,
} from "../models/UserDocumentsModel.mjs";
import CreatePayrollPdf from "../services/CreatePayrollPdf.mjs";
export const uploadFilesController = async (req, res) => {
  //Verify if a file has been uploaded
  if (!req.file) {
    //If no file has been uploaded, returns a 400 error
    return res.status(400).json({ message: "No file has been uploaded." });
  }
  //Extract the properties of the uploaded file
  const { originalname, mimetype, buffer } = req.file;
  const { document_type, user_id } = req.body;
  try {
    //Call the model to upload the file
    await uploadFilesModel(
      document_type,
      originalname,
      mimetype,
      buffer,
      user_id
    );
    //If it has risen correctly, returns a successful message
    return res.status(200).json({ message: "Archivo subido correctamente." });
  } catch (error) {
    //If there has been an error, return a 500 error
    return res.status(500).json({ message: "Error trying to save the file" });
  }
};

export const getDocumentsController = async (req, res) => {
  const { user_id } = req.query;
  try {
    const files = await getDocumentsModel(user_id); //Obtain requested files according to your user ID
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: "Error obtaining the files." });
  }
};

export const downloadUserDocumentController = async (req, res) => {
  const { documentId } = req.params;
  try {
    const response = await downloadUserDocumentModel(documentId);
    if (response.length === 0) {
      return res.status(404).json({ message: "File not found." });
    }
    //Extract the files from the file
    const { file_name, file_type, file_data } = response[0];

    //ensures that File_data is a buffer
    const buffer = Buffer.isBuffer(file_data)
      ? file_data
      : Buffer.from(file_data);

    //encodes the name of the file to ensure that it is correctly formatted
    const encodedFileName = encodeURIComponent(file_name.trim());

    //Set the headers of the file download response
    res.setHeader("Content-Type", file_type);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodedFileName}"`
    );
    res.setHeader("Content-Length", buffer.length);

    //Send the file buffer in response
    res.send(buffer);
  } catch (error) {
    //If an error occurs, print it on the console and return an error 500
    Sentry.captureException(error);
    return res.status(500).json({
      message: "Error when downloading the file in the controller.",
      error: error.message,
    });
  }
};

// 🔹 Controller to generate and send a payroll PDF
export const generatePayrollPdfController = async (req, res) => {
  // Extracts the user_id from the request parameters and payrollData from the request body
  const { user_id } = req.params;
  const { payrollData } = req.body;

  try {
    // 🔹 Create the payroll PDF buffer using the payroll data
    const buffer = await CreatePayrollPdf(payrollData);

    // 🔹 Prepare the PDF data, including the file name and extract date
    const pdfData = {
      file_name: `extracto_nomina${payrollData.date}.pdf`, // Generates the file name using the payroll date
      buffer,
      payrollExtractDate: payrollData.date,
    };

    // 🔹 If requestType is "save", save the PDF and send it as a downloadable file
    if (payrollData.requestType === "save") {
      await savePayrollPdfModel(user_id, pdfData); // Saves the PDF in the database

      // 🔹 Set headers for file download
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${pdfData.file_name}"`
      );

      // 🔹 Send the PDF buffer as the response and stop further execution
      return res.send(buffer);
    }

    // 🔹 If requestType is NOT "save", open the PDF in a new browser tab
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // Allows the PDF to be viewed in the browser

    // 🔹 Send the PDF buffer to be displayed in the browser
    res.send(buffer);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ message: "Error generating and sending the PDF" });
  }
};

// 🔹 Controller to get the list of payroll extracts for a user
export const getUserPayrollExtractsController = async (req, res) => {
  // Extracts the user_id from the query parameters
  const { user_id } = req.query;

  try {
    // 🔹 Obtain requested files according to the user ID from the model
    const files = await getUserPayrollExtractsModel(user_id);

    // 🔹 Return the list of files as a JSON response
    return res.status(200).json(files);
  } catch (error) {
    // 🔹 Handle errors and send a 500 status with an error message
    Sentry.captureException(error);
    return res.status(500).json({ message: "Error obtaining the files." });
  }
};

// 🔹 Controller to download a specific payroll extract by its ID
export const downloadUserPayrollExtracts = async (req, res) => {
  // Extracts the payrollExtractId from the request parameters
  const { payrollExtractId } = req.params;

  try {
    // 🔹 Get the requested file using the payroll extract ID from the model
    const response = await downloadUserPayrollExtractsModel(payrollExtractId);

    // 🔹 If no file is found, return a 404 status with an error message
    if (response.length === 0) {
      return res.status(404).json({ message: "File not found." });
    }

    // 🔹 Extracts file_name and file_data from the response
    const { file_name, file_data } = response[0];

    // 🔹 Ensure that file_data is a buffer
    const buffer = Buffer.isBuffer(file_data)
      ? file_data // If already a buffer, use it directly
      : Buffer.from(file_data); // Otherwise, convert it to a buffer

    // 🔹 Encode the file name to ensure it is correctly formatted
    const encodedFileName = encodeURIComponent(file_name.trim());
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    // 🔹 Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodedFileName}"`
    );

    // 🔹 Send the file buffer as the response and stop further execution
    return res.send(buffer);
  } catch (error) {
    // 🔹 Handle errors, log them in the console, and send a 500 status with an error message
    Sentry.captureException(error);
    return res.status(500).json({
      message: "Error when downloading the file in the controller.",
      error: error.message,
    });
  }
};
