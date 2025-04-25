'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Job } from '@/interfaces/explorer/file/job.interface';
import { FileInputs } from '@/schemas/explorer/file/file.schema';
import { useFileStore } from '@/store/useFileStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { MutationKeys } from '../../../constants.enum';

export const useEditFile = (id: string) => {
  const setJobId = useFileStore((state) => state.setJobId);

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
      enqueueSnackbar(data.message, { variant: 'success' });
      setJobId(data.data.jobId);
    },
    onError: () => {
      enqueueSnackbar('Error when editing the file', {
        variant: 'error',
      });
    },
  });
};
