import express from "express";
import verifyTokenAndPermisions from "../middlewares/VerifyUserAndPermissions.mjs";
import {
  uploadFilesController,
  getFilesController,
  downloadUserDocumentController,
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
  getFilesController //controller to get the files
);
router.get(
  "/downloadUserDocuments/:documentId",
  verifyTokenAndPermisions, //middleware to verify the token and permissions
  downloadUserDocumentController //controller to download the file
);

export default router;
