'use client';
import { client, setHeaderToken } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Session } from '@/interfaces/session/session.interface';
import { LoginInputs } from '@/schemas/login/login.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { MutationKeys } from '../../constants.enum';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Session>, AxiosError, LoginInputs>({
    mutationKey: [MutationKeys.LOGIN_KEY],
    mutationFn: (user: LoginInputs) =>
      client
        .post('/auth/sign-in', user, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      setHeaderToken(data.data.accessToken);
      router.push('/explorer');
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({
        refetchType: 'all',
      });
    },
    onError: () => {
      enqueueSnackbar('Invalid credentials', {
        variant: 'error',
      });
    },
  });
};
