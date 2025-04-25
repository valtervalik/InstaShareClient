import { client } from '@/http-client/client';
import { useGetUpdatedUploadStatus } from '@/queries/hooks/explorer/file/useGetUpdatedUploadStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/http-client/client');

describe('useGetUpdatedUploadStatus', () => {
  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  afterEach(() => {
    (client.get as jest.Mock).mockReset();
  });

  it('does not call API when jobId is null', () => {
    const { result } = renderHook(() => useGetUpdatedUploadStatus(null), {
      wrapper,
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(client.get).not.toHaveBeenCalled();
  });

  it('polls upload status when jobId provided', async () => {
    const mockStatus = { progress: 50, done: false };
    (client.get as jest.Mock).mockResolvedValue({ data: { data: mockStatus } });

    const { result } = renderHook(() => useGetUpdatedUploadStatus('job123'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.data?.data).toEqual(mockStatus);
      expect(client.get).toHaveBeenCalledWith('/files/upload/status/job123');
    });
  });
});
