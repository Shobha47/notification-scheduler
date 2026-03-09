// types/enquiry.ts
export type LeadStatus = "HOT" | "WARM" | "COLD" | "WON" | "LOST" | "HOLD";

export interface ReminderQuery {
  page: number;
  limit: number;
  search?: string;
  sortField?: "createdAt"  | "leadStatus";
  sortOrder?: "asc" | "desc";
  leadStatus?: LeadStatus;
  createdDate?: string;
}
