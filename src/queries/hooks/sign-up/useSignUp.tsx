'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Session } from '@/interfaces/session/session.interface';
import { SignUpInputs } from '@/schemas/sign-up/sign-up.schema';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { MutationKeys } from '../../constants.enum';

export const useSignUp = () => {
  const router = useRouter();

  return useMutation<ApiResponse<Session>, AxiosError, SignUpInputs>({
    mutationKey: [MutationKeys.SIGNUP_KEY],
    mutationFn: (user: SignUpInputs) =>
      client
        .post('/auth/sign-up', user, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (data) => {
      router.push('/login');
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
    },
  });
};
