// services/reminder.service.ts
import { buildReminderWhere } from "../filters/reminder.filter";
import { buildReminderOrderBy } from "../filters/reminder.sort";

export async function getReminders({
  prisma,
  userId,
  query,
}: any) {
  const skip = (query.page - 1) * query.limit;

  const where = buildReminderWhere({
    userId,
    search: query.search,
    leadStatus: query.leadStatus,
    createdDate: query.createdDate,
  });

  const orderBy = buildReminderOrderBy(
    query.sortField,
    query.sortOrder
  );

  const [data, total] = await prisma.$transaction([
    prisma.reminder.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.reminder.count({ where }),
  ]);

  console.log("DATA IN REMINDER SERVICE;", data);

  const pendingReminders = data.filter(
    (reminder: any) =>
      reminder.leadStatus === "HOT" && reminder.isConverted === false
  );
  
  const triggeredReminders = data.filter(
    (reminder: any) =>
      reminder.leadStatus === "COLD" && reminder.isConverted === true
  );

  return {
    data,
    summary: {
      totalReminders: total,
      pendingReminders: pendingReminders.length,
      triggeredReminders: triggeredReminders.length,
    },
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}

export async function createReminderService({
  prisma,
  userId,
  data,
}: {
  prisma: any;
  userId: string;
  data: any;
}) {
  const { title, description, notificationType, reminderAt } = data;

  const reminder = await prisma.reminder.create({
    data: {
      title,
      description: description || null,
      notificationType,
      reminderAt: new Date(reminderAt),
      userId,
    },
  });

  return reminder;
}

export async function updateReminderService({
  prisma,
  reminderId,
  data,
}: {
  prisma: any;
  reminderId: any;
  data: any;
}) {
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      ...data,
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : undefined,
    },
  });

  return reminder;
}