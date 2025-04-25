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

export const useUploadFile = () => {
  const setJobId = useFileStore((state) => state.setJobId);

  return useMutation<ApiResponse<Job>, AxiosError, FileInputs>({
    mutationKey: [MutationKeys.UPLOAD_FILE_KEY],
    mutationFn: async (file: FileInputs) => {
      const formData = new FormData();
      formData.append('filename', file.filename);
      formData.append('category', file.category);
      formData.append('file', file.file);
      return await client
        .post('/files/upload', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      setJobId(data.data.jobId);
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
    },
  });
};
