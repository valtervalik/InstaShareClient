'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { UploadStatus } from '@/interfaces/explorer/file/upload-status.interface';
import { QueryKeys } from '@/queries/constants.enum';
import { skipToken, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetUpdatedUploadStatus = (jobId: string | null) =>
  useQuery<ApiResponse<UploadStatus>, AxiosError>({
    queryKey: [QueryKeys.UPLOAD_FILE_STATUS_KEY, jobId],
    queryFn: jobId
      ? () =>
          client.get(`/files/upload/status/${jobId}`).then((res) => res.data)
      : skipToken,
    refetchInterval: 500,
  });
