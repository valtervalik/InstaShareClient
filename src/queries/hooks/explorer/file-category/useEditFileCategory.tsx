'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { FileCategoryInputs } from '@/schemas/explorer/file-category/file-category.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MutationKeys, QueryKeys } from '../../../constants.enum';

export const useEditFileCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<FileCategory>, AxiosError, FileCategoryInputs>(
    {
      mutationKey: [MutationKeys.EDIT_FILE_CATEGORY_KEY, id],
      mutationFn: (category: FileCategoryInputs) =>
        client
          .patch(`/file-categories/${id}`, category, { withCredentials: true })
          .then((res) => res.data),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
        });
      },
      onError: () => {
        toast.error('Failed to edit file category. Please try again.');
      },
    }
  );
};
