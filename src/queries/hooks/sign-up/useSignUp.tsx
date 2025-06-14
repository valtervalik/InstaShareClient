'use client';
import { client } from '@/http-client/client';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { Session } from '@/interfaces/session/session.interface';
import { SignUpInputs } from '@/schemas/sign-up/sign-up.schema';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Failed to sign up. Please try again.');
    },
  });
};
