import { client } from '@/http-client/client';
import { File } from '@/interfaces/explorer/file/file.interface';
import { QueryKeys } from '@/queries/constants.enum';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetFilesByCategory = (id: string) =>
  useQuery<File[], AxiosError>({
    queryKey: [QueryKeys.FILES_KEY, id],
    queryFn: () =>
      client.get(`/files?category=${id}`).then((res) => res.data.elements),
  });
