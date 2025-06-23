import { useIsMobile } from '@/hooks/use-mobile';
import { useAddFileCategory } from '@/queries/hooks/explorer/file-category/useAddFileCategory';
import { useGetFileCategories } from '@/queries/hooks/explorer/file-category/useGetFileCategories';
import { useDeleteFile } from '@/queries/hooks/explorer/file/useDeleteFile';
import { useEditFile } from '@/queries/hooks/explorer/file/useEditFile';
import { useGetFilesByCategory } from '@/queries/hooks/explorer/file/useGetFilesByCategory';
import { useUploadFile } from '@/queries/hooks/explorer/file/useUploadFile';
import { useLogin } from '@/queries/hooks/login/useLogin';
import { useSignUp } from '@/queries/hooks/sign-up/useSignUp';
import { useGetCurrentUser } from '@/queries/hooks/user/useGetCurrentUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import React from 'react';

// Mock window.matchMedia for the test environment
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// create a non-JSX wrapper for tests with a displayName for ESLint
const createWrapper = () => {
  const client = new QueryClient();

  // Named wrapper component to satisfy react/display-name rule
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(QueryClientProvider, { client }, children);
  Wrapper.displayName = 'QueryClientProviderWrapper';

  return Wrapper;
};

describe('Custom hooks', () => {
  it('useIsMobile returns boolean', () => {
    const { result } = renderHook(() => useIsMobile(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current).toBe('boolean');
  });

  [useLogin, useSignUp].forEach((hook) => {
    it(`${hook.name} returns mutation object`, () => {
      const { result } = renderHook(() => hook(), { wrapper: createWrapper() });
      if (hook === useSignUp) {
        result.current.mutate({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      }
      expect(result.current.mutate).toBeDefined();
    });
  });

  [
    useGetCurrentUser,
    useGetFileCategories,
    useAddFileCategory,
    useUploadFile,
    () => useDeleteFile('mock-id'),
    useEditFile,
    useGetFilesByCategory,
  ].forEach((hook) => {
    it(`${hook.name} returns query/mutation object`, () => {
      const { result } = renderHook(() => hook('mock-id'), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBeDefined();
    });
  });
});
