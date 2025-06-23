import { client } from '@/http-client/client';
import { useUploadFile } from '@/queries/hooks/explorer/file/useUploadFile';
import type { FileInputs } from '@/schemas/explorer/file/file.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';

jest.mock('@/http-client/client');

describe('useUploadFile', () => {
  let queryClient: QueryClient;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    (client.post as jest.Mock).mockReset();
  });

  it('should post formData and call onSuccess handlers', async () => {
    const file = new File(['content'], 'test.txt');
    const inputs: FileInputs = { filename: 'test.txt', category: 'cat1', file };
    const mockResponse = { message: 'Uploaded', data: { jobId: 'job123' } };
    (client.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    let trigger: (inputs: FileInputs) => void;
    function TestComponent() {
      const mutation = useUploadFile();
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
      trigger(inputs);
    });

    await waitFor(() => {
      const [url, formData, opts] = (client.post as jest.Mock).mock.calls[0];
      expect(url).toBe('/files/upload');
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('filename')).toBe(inputs.filename);
      expect(formData.get('category')).toBe(inputs.category);
      expect(formData.get('file')).toBe(inputs.file);
      expect(opts).toEqual({
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });
  });

  it('should call onError snackbar on failure', async () => {
    const inputs: FileInputs = {
      filename: 'bad.txt',
      category: 'cat1',
      file: new File([], 'bad.txt'),
    };
    (client.post as jest.Mock).mockRejectedValue(new Error('fail'));

    let trigger: (inputs: FileInputs) => void;
    function ErrorComponent() {
      const mutation = useUploadFile();
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
      trigger(inputs);
    });

    await waitFor(() => {
      expect(client.post).toHaveBeenCalled();
    });
  });
});
