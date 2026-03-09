// controllers/enquiryController.ts
import { Request, Response } from "express";
import { reminderCreateSchema, reminderQuerySchema } from "../validators/reminder.query";
import { createReminderService, getReminders, updateReminderService } from "../services/reminder.service";
import { centralPrisma } from "../prisma-client/central-client";

export async function addReminderController(req: Request, res: Response) {
  try {
    const prisma = centralPrisma;
    const user = (req as any).user;

    if (!prisma || !user || typeof user === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("REMINDER DATA:", req.body);

    const data = reminderCreateSchema.parse(req.body);

    console.log("REMINDER BODY PARSED SUCCESSFULLY");

    const reminder = await createReminderService({
      prisma,
      userId: user.id,
      data,
    });

    console.log("REMINDER CREATED SUCCESSFULLY");

    return res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }

    console.error("Error creating reminder:", err);

    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}


export async function updateReminderController(req: Request, res: Response) {
  try {
    const prisma = centralPrisma;
    const user = (req as any).user;

    if (!prisma || !user || typeof user === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { reminderId } = req.params;

    const data = reminderCreateSchema.partial().parse(req.body);

    const reminder = await updateReminderService({
      prisma,
      reminderId,
      data,
    });

    return res.status(200).json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }

    console.error("Error updating reminder:", err);

    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}

export async function getReminderController(req: Request, res: Response) {
  try {
    const prisma = centralPrisma;
    const user = (req as any).user;

    if (!prisma || !user || typeof user === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = reminderQuerySchema.parse(req.query);

    const result = await getReminders({
      prisma,
      userId: user.id,
      query,
    });

    return res.json({
      message: "Reminders fetched successfully",
      ...result,
      page: query.page,
      limit: query.limit,
    });

  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }

    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
