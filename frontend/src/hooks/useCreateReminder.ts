// src/hooks/useCreateReminder.ts
import { useMutation } from "@tanstack/react-query";
import { createReminderAPI, getReminder } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setError, setLoading, setReminders } from "@/store/slice/reminderSlice";

export const useCreateReminder = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (newReminderData: any) => {
      if (!token) throw new Error("Missing token for create reminder");

      dispatch(setLoading(true));
      await createReminderAPI(token, newReminderData);

      // Return token for onSuccess
      return { token };
    },

    onSuccess: async ({ token }) => {
      try {
        // Refetch latest enquiries
        const updated = await getReminder({
          token,
          page: 1,
          limit: 5,
          sortField: "createdAt",
        });

        dispatch(setReminders(updated.reminder));
        dispatch(setError(null));
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to fetch updated reminder"));
      } finally {
        dispatch(setLoading(false));
      }
    },

    onError: (error: any) => {
      const backend = error?.response?.data?.error || "Failed to create reminder";
      dispatch(setError(backend));
      dispatch(setLoading(false));
    },
  });
};
