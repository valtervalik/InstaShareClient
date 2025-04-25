import { client } from '@/http-client/client';
import { useEditFile } from '@/queries/hooks/explorer/file/useEditFile';
import { useFileStore } from '@/store/useFileStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

jest.mock('@/http-client/client');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('@/store/useFileStore');

describe('useEditFile', () => {
  let queryClient: QueryClient;
  const mockSetJobId = jest.fn();
  const Wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    (useFileStore as unknown as jest.Mock).mockImplementation((sel: any) =>
      sel({ setJobId: mockSetJobId })
    );
    (client.patch as jest.Mock).mockReset();
    (enqueueSnackbar as jest.Mock).mockClear();
    mockSetJobId.mockClear();
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
      expect(enqueueSnackbar).toHaveBeenCalledWith('Edited', {
        variant: 'success',
      });
      expect(mockSetJobId).toHaveBeenCalledWith('j1');
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
    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Error when editing the file',
        { variant: 'error' }
      );
    });
  });
});
