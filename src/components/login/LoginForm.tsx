'use client';
import { useLogin } from '@/queries/hooks/login/useLogin';
import { LoginInputs, loginSchema } from '@/schemas/login/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function LoginForm() {
  const loginMutation = useLogin();

  const { register, handleSubmit } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) =>
    loginMutation.mutate(data);

  return (
    <form className='grid gap-3 py-3 px-5' onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className='dark:bg-gray-700 rounded-md'
        type='email'
        size='small'
        label='Email'
        {...register('email', { required: true })}
      />

      <TextField
        className='dark:bg-gray-700 rounded-md'
        type='password'
        size='small'
        label='Contraseña'
        {...register('password', { required: true })}
      />

      <Button type='submit'>Iniciar Sesión</Button>
    </form>
  );
}
