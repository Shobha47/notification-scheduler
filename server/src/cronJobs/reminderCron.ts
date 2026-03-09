import cron from "node-cron";
import { centralPrisma } from "../prisma-client/central-client";
import { sendEmail } from "../utils/email";

export const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running reminder cron job...", new Date());

    try {
      const now = new Date();
      const dueReminders = await centralPrisma.reminder.findMany({
        where: {
          reminderAt: { lte: now },
          isConverted: false,
        },
        include: { user: true },
      });

      for (const reminder of dueReminders) {
        // 1️⃣ Create Notification in DB
        await centralPrisma.notification.create({
          data: {
            message: reminder.title,
            reminderId: reminder.id,
            userId: reminder.userId,
          },
        });

        // 2️⃣ Send email if required
        if (reminder.notificationType === "EMAIL" && reminder.user.email) {
          try {
            await sendEmail({
              to: reminder.user.email,
              subject: "Reminder Notification",
              text: `${reminder.title}\n\n${reminder.description || ""}`,
            });
            console.log(`Email sent to ${reminder.user.email} for reminder ${reminder.title}`);
          } catch (emailErr) {
            console.error("Failed to send email:", emailErr);
          }
        }

        // 3️⃣ Mark reminder as converted
        await centralPrisma.reminder.update({
          where: { id: reminder.id },
          data: { isConverted: true },
        });
      }
    } catch (err) {
      console.error("Reminder cron job error:", err);
    }
  });
};