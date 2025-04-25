import { client } from '@/http-client/client';
import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { QueryKeys } from '@/queries/constants.enum';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetFileCategories = () =>
  useQuery<FileCategory[], AxiosError>({
    queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
    queryFn: () =>
      client.get(`/file-categories`).then((res) => res.data.elements),
  });
