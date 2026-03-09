// useQueryFetchReminder.ts
import { getReminder } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface GetReminderParams {
  token: string | null;
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useFetchReminder = ({
  token,
  page = 1,
  limit = 5,
  search = '',
  sortField,
  sortOrder,
}: GetReminderParams) => {
  return useQuery({
    queryKey: ['reminder', page, limit, search, sortField, sortOrder],
    queryFn: async () => {
      if (!token) throw new Error('Missing token');
      const data = await getReminder({
        token,
        page,
        limit,
        search,
        sortField,
        sortOrder,
      });

      if (!data) throw new Error('No data returned');

      return data;
    },
    enabled: !!token,
  });
};
