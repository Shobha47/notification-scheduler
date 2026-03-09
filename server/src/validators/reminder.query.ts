import { z } from "zod";

export const reminderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortField: z.enum(["createdAt", "leadStatus"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  leadStatus: z.enum(["HOT", "COLD"]).optional(),
  courseId: z.coerce.number().optional(),
  createdDate: z.string().optional(),
});

export const reminderCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.preprocess(
    (val: string | null) => (val === "" || val === null ? undefined : val),
    z.string().optional()
  ),

  notificationType: z.enum(["EMAIL", "IN_APP"]),

  reminderAt: z.string().min(1, "Reminder date is required"),
});


export const enquiryEditSchema = z.object({
  id: z.string().min(1, "Enquiry ID is required"),
  title: z.string().min(1, "Title is required"),

  description: z.preprocess(
    (val: string | null) => (val === "" || val === null ? undefined : val),
    z.string().optional()
  ),

  notificationType: z.enum(["EMAIL", "IN_APP"]),

  reminderAt: z.string().min(1, "Reminder date is required"),
});