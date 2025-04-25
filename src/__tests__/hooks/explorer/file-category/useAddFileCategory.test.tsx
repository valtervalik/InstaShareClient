import { client } from '@/http-client/client';
import { QueryKeys } from '@/queries/constants.enum';
import { useAddFileCategory } from '@/queries/hooks/explorer/file-category/useAddFileCategory';
import type { FileCategoryInputs } from '@/schemas/explorer/file-category/file-category.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';

jest.mock('@/http-client/client');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('useAddFileCategory', () => {
  let queryClient: QueryClient;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    jest.spyOn(queryClient, 'invalidateQueries');
    (client.post as jest.Mock).mockReset();
    (enqueueSnackbar as jest.Mock).mockClear();
  });

  it('should call post and invalidate queries on success', async () => {
    const mockResponse = {
      message: 'Category added successfully',
      data: { _id: '1', name: 'Folder1' },
    };
    (client.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    let trigger: (inputs: FileCategoryInputs) => void;
    function TestComponent() {
      const mutation = useAddFileCategory();
      useEffect(() => {
        trigger = mutation.mutate;
      }, [mutation]);
      return null;
    }

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );
    act(() => {
      trigger({ name: 'Folder 1' });
    });

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith(
        '/file-categories',
        { name: 'Folder 1' },
        { withCredentials: true }
      );
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
      });
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Category added successfully',
        { variant: 'success' }
      );
    });
  });

  it('should show error snackbar on failure', async () => {
    (client.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    let trigger: (inputs: FileCategoryInputs) => void;
    function ErrorComponent() {
      const mutation = useAddFileCategory();
      useEffect(() => {
        trigger = mutation.mutate;
      }, [mutation]);
      return null;
    }

    render(
      <Wrapper>
        <ErrorComponent />
      </Wrapper>
    );
    act(() => {
      trigger({ name: 'Bad name' });
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Error when adding the category',
        { variant: 'error' }
      );
    });
  });
});
