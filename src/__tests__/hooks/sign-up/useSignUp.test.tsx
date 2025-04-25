import { client } from '@/http-client/client';
import { useSignUp } from '@/queries/hooks/sign-up/useSignUp';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

jest.mock('@/http-client/client');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('useSignUp', () => {
  let push: jest.Mock;
  let qc: QueryClient;
  const Wrapper = ({ children }: any) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (client.post as jest.Mock).mockReset();
    (enqueueSnackbar as jest.Mock).mockClear();
  });

  it('signs up and redirects', async () => {
    const resp = { message: 'Welcome!', data: {} };
    (client.post as jest.Mock).mockResolvedValue({ data: resp });
    let trigger: any;
    function Test() {
      const m = useSignUp();
      useEffect(() => {
        trigger = m.mutate;
      }, [m]);
      return null;
    }

    render(
      <Wrapper>
        <Test />
      </Wrapper>
    );
    act(() => trigger({ email: 'a', password: 'p', confirmPassword: 'p' }));
    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith(
        '/auth/sign-up',
        { email: 'a', password: 'p', confirmPassword: 'p' },
        { withCredentials: true }
      );
      expect(push).toHaveBeenCalledWith('/login');
      expect(enqueueSnackbar).toHaveBeenCalledWith('Welcome!', {
        variant: 'success',
      });
    });
  });

  it('handles failure', async () => {
    (client.post as jest.Mock).mockRejectedValue(new Error('fail'));
    let trigger: any;
    function Err() {
      const m = useSignUp();
      useEffect(() => {
        trigger = m.mutate;
      }, [m]);
      return null;
    }

    render(
      <Wrapper>
        <Err />
      </Wrapper>
    );
    act(() => trigger({ email: '', password: '', confirmPassword: '' }));
    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Something went wrong', {
        variant: 'error',
      });
    });
  });
});
