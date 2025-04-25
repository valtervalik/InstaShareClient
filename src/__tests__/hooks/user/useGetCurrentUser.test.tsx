import { client } from '@/http-client/client';
import { useGetCurrentUser } from '@/queries/hooks/user/useGetCurrentUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';

jest.mock('@/http-client/client');

describe('useGetCurrentUser', () => {
  const wrapper = ({ children }: any) => (
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {children}
    </QueryClientProvider>
  );

  afterEach(() => {
    (client.get as jest.Mock).mockReset();
  });

  it('fetches user on success', async () => {
    const user = { _id: 'u1', email: 'a@b.com' };
    (client.get as jest.Mock).mockResolvedValue({ data: user });
    const { result } = renderHook(() => useGetCurrentUser(), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toEqual(user);
      expect(result.current.isError).toBe(false);
    });
  });

  it('handles error', async () => {
    const err = new AxiosError('no auth');
    (client.get as jest.Mock).mockRejectedValue(err);
    const { result } = renderHook(() => useGetCurrentUser(), { wrapper });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(err);
    });
  });
});
