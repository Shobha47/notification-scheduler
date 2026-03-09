// routes/reminderRoutes.ts
import { Router } from "express";
import {
  addReminderController,
  getReminderController,
  updateReminderController,
} from "../controllers/reminder.controller";

const router = Router();

router.post("/create-reminder", addReminderController);
router.put("/edit-reminder", updateReminderController);
router.get("/reminder", getReminderController);


export default router;
