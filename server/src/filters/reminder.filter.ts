// filters/enquiry.filter.ts
import { PrismaClient, $Enums } from "../../prisma-client/generated/central";
import { normalizeEmail, normalizeToLowercase, titleCase } from "../utils/Normalize";

type ReminderWhere = NonNullable<
  Parameters<PrismaClient["reminder"]["findMany"]>[0]
>["where"];

export function buildReminderWhere({
  userId,
  search,
  leadStatus,
  createdDate,
}: {
  userId: string; // ✅ matches schema
  search?: string;
  leadStatus?: $Enums.LeadStatus;
  createdDate?: string;
}): ReminderWhere {

  const where: ReminderWhere = {
    userId,
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (leadStatus) {
    where.leadStatus = leadStatus;
  }

  if (createdDate) {
    const start = new Date(createdDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(createdDate);
    end.setHours(23, 59, 59, 999);

    where.createdAt = { gte: start, lte: end };
  }

  return where;
}
