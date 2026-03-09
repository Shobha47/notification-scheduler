import cron from "node-cron";
import { centralPrisma } from "../prisma-client/central-client";
import { getIO } from "../utils/socket";
import nodemailer from "nodemailer";

// Configure email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running reminder cron job...", new Date());

    try {
      const now = new Date();

      const dueReminders = await centralPrisma.reminder.findMany({
        where: {
          reminderAt: { lte: now },
          isConverted: false,
          leadStatus: "HOT"
        },
        include: { user: true },
      });

      const io = getIO();

      for (const reminder of dueReminders) {
        // Create notification in DB
        const notification = await centralPrisma.notification.create({
          data: {
            message: reminder.title,
            reminderId: reminder.id,
            userId: reminder.userId,
          },
        });

        console.log("GET AL NOTIIFCTAION:", notification);

        // ✅ Send notification based on type
        if (reminder.notificationType === "IN_APP") {
          // Emit via Socket.IO to frontend
          io.to(reminder.userId).emit("reminder-notification", {
            id: notification.id,
            notificationMessage: notification.message,
            createdAt: notification.createdAt,
          });
          console.log(`🔔 In-App Reminder sent to user ${reminder.user.email}`);
        } else if (reminder.notificationType === "EMAIL") {
          // Send email
          if (reminder.user.email) {
            await transporter.sendMail({
              from: `"Your App" <${process.env.SMTP_USER}>`,
              to: reminder.user.email,
              subject: "Reminder Notification",
              text: `${reminder.title}\n\n${reminder.description || ""}`,
            });
            console.log(`📧 Email Reminder sent to ${reminder.user.email}`);
          }
        }

        // Mark reminder as converted so it won't repeat
        await centralPrisma.reminder.update({
          where: { id: reminder.id },
          data: { isConverted: true, leadStatus: "COLD" },
        });
      }
    } catch (err) {
      console.error("Reminder cron error:", err);
    }
  });
};