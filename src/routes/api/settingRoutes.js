import { Router } from "express";
import {
  getSpendingLimit,
  updateSpendingLimit,
} from "../../controllers/api/SettingController.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import checkAdmin from "../../middleware/checkAdmin.js";

const router = Router();

router.get("/spending-limit", getSpendingLimit);
router.put("/spending-limit", jwtAuth, checkAdmin, updateSpendingLimit);

export default router;
