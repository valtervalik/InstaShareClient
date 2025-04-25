'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { FileCategoryInputs } from '@/schemas/explorer/file-category/file-category.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { MutationKeys, QueryKeys } from '../../../constants.enum';

export const useAddFileCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<FileCategory>, AxiosError, FileCategoryInputs>(
    {
      mutationKey: [MutationKeys.FILE_CATEGORY_KEY],
      mutationFn: (category: FileCategoryInputs) =>
        client
          .post('/file-categories', category, { withCredentials: true })
          .then((res) => res.data),
      onSuccess: (data) => {
        enqueueSnackbar(data.message, { variant: 'success' });
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
        });
      },
      onError: () => {
        enqueueSnackbar('Error when adding the category', {
          variant: 'error',
        });
      },
    }
  );
};
