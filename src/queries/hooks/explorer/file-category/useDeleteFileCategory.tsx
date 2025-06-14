'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MutationKeys, QueryKeys } from '../../../constants.enum';

export const useDeleteFileCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError, null>({
    mutationKey: [MutationKeys.DELETE_FILE_CATEGORY_KEY, id],
    mutationFn: () =>
      client
        .delete(`/file-categories/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
      });
    },
    onError: () => {
      toast.error('Failed to delete file category. Please try again.');
    },
  });
};
