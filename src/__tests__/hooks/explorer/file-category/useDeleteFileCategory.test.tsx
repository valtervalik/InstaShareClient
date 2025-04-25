import { client } from '@/http-client/client';
import { QueryKeys } from '@/queries/constants.enum';
import { useDeleteFileCategory } from '@/queries/hooks/explorer/file-category/useDeleteFileCategory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';

jest.mock('@/http-client/client');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('useDeleteFileCategory', () => {
  let queryClient: QueryClient;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    jest.spyOn(queryClient, 'invalidateQueries');
    (client.delete as jest.Mock).mockReset();
    (enqueueSnackbar as jest.Mock).mockClear();
  });

  it('should call delete and invalidate queries on success', async () => {
    const mockResponse = { message: 'Deleted successfully' };
    (client.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    let trigger: () => void;
    function TestComponent() {
      const mutation = useDeleteFileCategory('abc');
      useEffect(() => {
        trigger = () => mutation.mutate(null);
      }, [mutation]);
      return null;
    }

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );
    act(() => {
      trigger();
    });

    await waitFor(() => {
      expect(client.delete).toHaveBeenCalledWith('/file-categories/abc', {
        withCredentials: true,
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
      });
      expect(enqueueSnackbar).toHaveBeenCalledWith('Deleted successfully', {
        variant: 'success',
      });
    });
  });

  it('should show error snackbar on failure', async () => {
    (client.delete as jest.Mock).mockRejectedValue(new Error('Network error'));

    let triggerError: () => void;
    function ErrorComponent() {
      const mutation = useDeleteFileCategory('xyz');
      useEffect(() => {
        triggerError = () => mutation.mutate(null);
      }, [mutation]);
      return null;
    }

    render(
      <Wrapper>
        <ErrorComponent />
      </Wrapper>
    );
    act(() => {
      triggerError();
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Error when deleting the folder',
        { variant: 'error' }
      );
    });
  });
});
