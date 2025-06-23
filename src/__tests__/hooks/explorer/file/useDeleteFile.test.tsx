import { client } from '@/http-client/client';
import { useDeleteFile } from '@/queries/hooks/explorer/file/useDeleteFile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';

jest.mock('@/http-client/client');

describe('useDeleteFile', () => {
  let qc: QueryClient;
  const Wrapper = ({ children }: any) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    (client.delete as jest.Mock).mockReset();
    jest.spyOn(qc, 'invalidateQueries');
  });

  it('calls delete and invalidates on success', async () => {
    (client.delete as jest.Mock).mockResolvedValue({
      data: { message: 'Gone' },
    });
    let trigger: any;
    function Test() {
      const m = useDeleteFile('fid');
      useEffect(() => {
        trigger = () => m.mutate(null);
      }, [m]);
      return null;
    }

    render(
      <Wrapper>
        <Test />
      </Wrapper>
    );
    act(() => trigger());
    await waitFor(() => {
      expect(client.delete).toHaveBeenCalledWith('/files/fid', {
        withCredentials: true,
      });
      expect(qc.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['files', undefined],
      });
    });
  });

  it('shows error snackbar on failure', async () => {
    (client.delete as jest.Mock).mockRejectedValue(new Error('oops'));
    let trigger: any;
    function TestErr() {
      const m = useDeleteFile('fid2');
      useEffect(() => {
        trigger = () => m.mutate(null);
      }, [m]);
      return null;
    }

    render(
      <Wrapper>
        <TestErr />
      </Wrapper>
    );
    act(() => trigger());
    await waitFor(() => {});
  });
});
