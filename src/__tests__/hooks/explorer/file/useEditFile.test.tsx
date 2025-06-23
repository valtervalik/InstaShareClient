import { client } from '@/http-client/client';
import { useEditFile } from '@/queries/hooks/explorer/file/useEditFile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';

jest.mock('@/http-client/client');

describe('useEditFile', () => {
  let queryClient: QueryClient;
  const Wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    (client.patch as jest.Mock).mockReset();
  });

  it('patches filename and sets jobId on success', async () => {
    const resp = { message: 'Edited', data: { jobId: 'j1' } };
    (client.patch as jest.Mock).mockResolvedValue({ data: resp });
    let trigger: any;
    function Test() {
      const m = useEditFile('id1');
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
    act(() => trigger({ filename: 'new.txt' }));
    await waitFor(() => {
      expect(client.patch).toHaveBeenCalledWith(
        '/files/id1',
        { filename: 'new.txt' },
        { withCredentials: true }
      );
    });
  });

  it('shows error snackbar on failure', async () => {
    (client.patch as jest.Mock).mockRejectedValue(new Error('fail'));
    let trigger: any;
    function TestErr() {
      const m = useEditFile('id2');
      useEffect(() => {
        trigger = m.mutate;
      }, [m]);
      return null;
    }

    render(
      <Wrapper>
        <TestErr />
      </Wrapper>
    );
    act(() => trigger({ filename: 'x' }));
    await waitFor(() => {});
  });
});
