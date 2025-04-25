import { client } from '@/http-client/client';
import { User } from '@/interfaces/user/user.interface';
import { QueryKeys } from '@/queries/constants.enum';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetCurrentUser = () =>
  useQuery<User | null, AxiosError>({
    queryKey: [QueryKeys.CURRENT_USER_KEY],
    queryFn: async () => {
      const res = await client.get(`/auth/current-user`);
      return res.data;
    },
  });
