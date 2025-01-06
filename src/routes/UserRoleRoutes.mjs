import express from "express";
import {
  getUserRoleController,
  getAllPermissionsControllers,
} from "../controllers/UserRoleController.mjs";

const router = express.Router();

router.get("/userRole/:roleId", getUserRoleController);
router.get("/getAllPermissions", getAllPermissionsControllers);

export default router;
