// filters/enquiry.sort.ts
export function buildReminderOrderBy(
  sortField: string,
  sortOrder: "asc" | "desc"
) {

  if (sortField === "createdAt") {
    return { createdAt: sortOrder };
  }

  return { createdAt: "desc" };
}
