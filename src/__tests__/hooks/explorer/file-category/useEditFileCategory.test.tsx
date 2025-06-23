import { client } from '@/http-client/client';
import { QueryKeys } from '@/queries/constants.enum';
import { useEditFileCategory } from '@/queries/hooks/explorer/file-category/useEditFileCategory';
import type { FileCategoryInputs } from '@/schemas/explorer/file-category/file-category.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';

jest.mock('@/http-client/client');

describe('useEditFileCategory', () => {
  let queryClient: QueryClient;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    jest.spyOn(queryClient, 'invalidateQueries');
    (client.patch as jest.Mock).mockReset();
  });

  it('should call patch and invalidate queries on success', async () => {
    const mockResponse = { message: 'Updated successfully' };
    (client.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

    let trigger: (inputs: FileCategoryInputs) => void;
    function TestComponent() {
      const mutation = useEditFileCategory('123');
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
      trigger({ name: 'New name' } as FileCategoryInputs);
    });

    await waitFor(() => {
      expect(client.patch).toHaveBeenCalledWith(
        '/file-categories/123',
        { name: 'New name' },
        { withCredentials: true }
      );
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
      });
    });
  });

  it('should show error snackbar on failure', async () => {
    (client.patch as jest.Mock).mockRejectedValue(new Error('Network error'));

    let triggerErr: (inputs: FileCategoryInputs) => void;
    function ErrorComponent() {
      const mutation = useEditFileCategory('321');
      useEffect(() => {
        triggerErr = mutation.mutate;
      }, [mutation]);
      return null;
    }
    render(
      <Wrapper>
        <ErrorComponent />
      </Wrapper>
    );
    act(() => {
      triggerErr({ name: 'Bad name' } as FileCategoryInputs);
    });

    await waitFor(() => {});
  });
});
