import { client } from '@/http-client/client';
import { useGetFilesByCategory } from '@/queries/hooks/explorer/file/useGetFilesByCategory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';

jest.mock('@/http-client/client');

describe('useGetFilesByCategory', () => {
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

  it('fetches and returns file list on success', async () => {
    const mockFiles = [
      { _id: '1', filename: 'a', ref: '', size: 1, compressedSize: 1 },
    ];
    (client.get as jest.Mock).mockResolvedValue({
      data: { elements: mockFiles },
    });

    const { result } = renderHook(() => useGetFilesByCategory('cat1'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.data).toEqual(mockFiles);
      expect(client.get).toHaveBeenCalledWith('/files?category=cat1');
      expect(result.current.isError).toBe(false);
    });
  });

  it('sets isError on failure', async () => {
    const err = new AxiosError('fail');
    (client.get as jest.Mock).mockRejectedValue(err);

    const { result } = renderHook(() => useGetFilesByCategory('bad'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(err);
    });
  });
});
