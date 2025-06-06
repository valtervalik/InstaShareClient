'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Job } from '@/interfaces/explorer/file/job.interface';
import { FileInputs } from '@/schemas/explorer/file/file.schema';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MutationKeys } from '../../../constants.enum';

export const useUploadFile = () => {
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
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Failed to upload file. Please try again.');
    },
  });
};
