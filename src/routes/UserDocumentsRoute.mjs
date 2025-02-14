import express from "express";
import verifyTokenAndPermisions from "../middlewares/VerifyUserAndPermissions.mjs";
import {
  uploadFilesController,
  getDocumentsController,
  downloadUserDocumentController,
  generatePayrollPdfController,
  getUserPayrollExtractsController,
  downloadUserPayrollExtracts
} from "../controllers/UserDocumentsController.mjs";
import multer from "multer";
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), //store the file in memory
});

router.post(
  "/uploadUserDocuments",
  upload.single("file"), //multer.single to handle a single file
  verifyTokenAndPermisions, //middleware to verify the token and permissions
  uploadFilesController //controller to upload the file
);

router.get(
  "/getUserDocuments",
  verifyTokenAndPermisions, //middleware to verify the token and permissions
  getDocumentsController //controller to get the files
);
router.get(
  "/downloadUserDocuments/:documentId",
  verifyTokenAndPermisions, //middleware to verify the token and permissions
  downloadUserDocumentController //controller to download the file
);

//Routes to create and manage user payroll extracts
router.get(
  "/getUserPayrollExtracts",
  verifyTokenAndPermisions,
  getUserPayrollExtractsController //controller to get the files
);

//Download a especific payroll extract pdf
router.get(
  "/downloadUserPayrollExtracts/:payrollExtractId",
  verifyTokenAndPermisions,
  downloadUserPayrollExtracts //controller to download the file
);
//Create or download payroll extract pdf
router.put("/generatePayrollPdf/:user_id",verifyTokenAndPermisions, generatePayrollPdfController);

export default router;
