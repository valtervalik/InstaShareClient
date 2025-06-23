import { client, setHeaderToken } from '@/http-client/client';
import { useLogin } from '@/queries/hooks/login/useLogin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

jest.mock('@/http-client/client');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('useLogin', () => {
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
    (setHeaderToken as jest.Mock).mockClear();
  });

  it('logs in successfully', async () => {
    const resp = { message: 'Hi', data: { accessToken: 'tok' } };
    (client.post as jest.Mock).mockResolvedValue({ data: resp });
    let trigger: any;
    function Test() {
      const m = useLogin();
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
    act(() => trigger({ email: 'e', password: 'p' }));
    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith(
        '/auth/sign-in',
        { email: 'e', password: 'p' },
        { withCredentials: true }
      );
      expect(setHeaderToken).toHaveBeenCalledWith('tok');
      expect(push).toHaveBeenCalledWith('/explorer');
    });
  });

  it('shows error on bad credentials', async () => {
    (client.post as jest.Mock).mockRejectedValue(new Error('bad'));
    let trigger: any;
    function Err() {
      const m = useLogin();
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
    act(() => trigger({ email: '', password: '' }));
    await waitFor(() => {});
  });
});
