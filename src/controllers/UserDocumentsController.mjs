import {
  uploadFilesModel,
  getFilesModel,
  downloadUserDocumentModel,
} from "../models/UserDocumentsModel.mjs";

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
    return res.status(500).json({ message: "Error when you upload the file." });
  }
};

export const getFilesController = async (req, res) => {
  const { user_id } = req.body;
  try {
    const files = await getFilesModel(user_id); //Obtain requested files according to your user ID
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: "Error obtaining the files." });
  }
};

export const downloadUserDocumentController = async (req, res) => {
  const { id } = req.body;
  try {
    const response = await downloadUserDocumentModel(id);
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

    // Envía el buffer del archivo como respuesta
    res.send(buffer);
  } catch (error) {
    //If an error occurs, print it on the console and return an error 500
    console.error("Error when downloading the file:", error);
    return res.status(500).json({
      message: "Error when downloading the file in the controller.",
      error: error.message,
    });
  }
};
