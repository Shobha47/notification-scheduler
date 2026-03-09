import { getReminder } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type GetReminderParams = {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc"; // ✅ Strict union
};

export const useFetchReminder = () => {
  return useMutation({
    // Accept the whole object
    mutationFn: async (params: GetReminderParams) => {
        console.log("get All Params:", params);
      return await getReminder(params); // ✅ Now you're passing the full object
    },
    onSuccess: (data) => {
      console.log("Reminders data fetched successfully:", data);
      // You can dispatch to Redux or navigate if needed
    },
    onError: (error) => {
      console.error("Error fetching Reminders data:", error);
    },
  });
};
