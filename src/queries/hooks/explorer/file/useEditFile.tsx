'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Job } from '@/interfaces/explorer/file/job.interface';
import { FileInputs } from '@/schemas/explorer/file/file.schema';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MutationKeys } from '../../../constants.enum';

export const useEditFile = (id: string) => {
  return useMutation<
    ApiResponse<Job>,
    AxiosError,
    Pick<FileInputs, 'filename'>
  >({
    mutationKey: [MutationKeys.EDIT_FILE_KEY, id],
    mutationFn: (file: Pick<FileInputs, 'filename'>) =>
      client
        .patch(`/files/${id}`, file, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Failed to edit file. Please try again.');
    },
  });
};
