import { client } from '@/http-client/client';
import { useGetFileCategories } from '@/queries/hooks/explorer/file-category/useGetFileCategories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';

jest.mock('@/http-client/client');

describe('useGetFileCategories', () => {
  const wrapper = ({ children }: any) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  afterEach(() => {
    (client.get as jest.Mock).mockReset();
  });

  it('returns list on success', async () => {
    const cats = [{ _id: 'c1', name: 'One' }];
    (client.get as jest.Mock).mockResolvedValue({ data: { elements: cats } });
    const { result } = renderHook(() => useGetFileCategories(), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toEqual(cats);
      expect(result.current.isError).toBe(false);
    });
  });

  it('sets isError on failure', async () => {
    const err = new AxiosError('bad');
    (client.get as jest.Mock).mockRejectedValue(err);
    const { result } = renderHook(() => useGetFileCategories(), { wrapper });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(err);
    });
  });
});
