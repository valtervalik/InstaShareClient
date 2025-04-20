'use client';
import { client, setHeaderToken } from '@/http-client/client';
import { LoginInputs } from '@/schemas/login/login.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { MutationKeys, QueryKeys } from '../../constants.enum';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MutationKeys.LOGIN_KEY],
    mutationFn: (user: LoginInputs) =>
      client
        .post('/auth/sign-in', user, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      setHeaderToken(data.accessToken || null);
      router.push('/');
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CURRENT_USER_KEY] });
    },
    onError: () => {
      enqueueSnackbar('Credenciales incorrectas', {
        variant: 'error',
      });
    },
  });
};
