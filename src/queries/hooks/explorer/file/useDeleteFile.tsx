'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MutationKeys, QueryKeys } from '../../../constants.enum';

export const useDeleteFile = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError, null>({
    mutationKey: [MutationKeys.DELETE_FILE_KEY, id],
    mutationFn: () =>
      client
        .delete(`/files/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FILES_KEY],
      });
    },
    onError: () => {
      toast.error('Failed to delete file. Please try again.');
    },
  });
};
