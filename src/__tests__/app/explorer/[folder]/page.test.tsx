import FolderPage from '@/app/explorer/[folder]/page';
import { useDeleteFileCategory } from '@/queries/hooks/explorer/file-category/useDeleteFileCategory';
import { useGetCurrentUser } from '@/queries/hooks/user/useGetCurrentUser';
import { useFileCategoryStore } from '@/store/useFileCategoryStore';
import { useSessionStore } from '@/store/useSessionStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/queries/hooks/user/useGetCurrentUser');
jest.mock('@/queries/hooks/explorer/file-category/useDeleteFileCategory');
jest.mock('@/store/useFileCategoryStore');
jest.mock('@/store/useSessionStore');
jest.mock('@/hooks/use-mobile');
jest.mock('sonner');
jest.mock('@/http-client/client', () => ({
  API_URL: 'http://localhost:3001/api',
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('@/http-client/client', () => ({
  API_URL: 'http://localhost:3001/api',
}));
jest.mock('@/components/explorer/file/Files', () => {
  return function MockFiles() {
    return <div data-testid='files-component'>Files Component</div>;
  };
});
jest.mock('@/components/explorer/file/AddFileForm', () => {
  return function MockAddFileForm({
    setOpen,
  }: {
    setOpen: (open: boolean) => void;
  }) {
    return (
      <div data-testid='add-file-form'>
        <button onClick={() => setOpen(false)}>Close Form</button>
      </div>
    );
  };
});
jest.mock('@/components/explorer/file-category/EditFileCategoryForm', () => {
  return function MockEditFileCategoryForm({
    setOpen,
    setOpenEdit,
  }: {
    setOpen: (open: boolean) => void;
    setOpenEdit: (open: boolean) => void;
  }) {
    return (
      <div data-testid='edit-file-category-form'>
        <button
          onClick={() => {
            setOpen(false);
            setOpenEdit(false);
          }}
        >
          Close Edit Form
        </button>
      </div>
    );
  };
});

// Mock EventSource
const mockEventSource = {
  onmessage: null as any,
  onerror: null as any,
  close: jest.fn(),
};

Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: jest.fn(() => mockEventSource),
});

describe('FolderPage', () => {
  let queryClient: QueryClient;
  const mockSetSession = jest.fn();
  const mockDeleteMutate = jest.fn();

  const mockUser = {
    _id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockFileCategory = {
    _id: 'category-123',
    name: 'Test Category',
    userId: 'user-123',
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock store implementations
    (useSessionStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('setSession')) return mockSetSession;
      if (selector.toString().includes('token')) return 'mock-token';
      return null;
    });

    (useFileCategoryStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector.toString().includes('fileCategory'))
          return mockFileCategory;
        return null;
      }
    );

    // Mock hook implementations
    (useGetCurrentUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    (useDeleteFileCategory as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isLoading: false,
      error: null,
    });

    // Mock mobile hook
    require('@/hooks/use-mobile').useIsMobile = jest
      .fn()
      .mockReturnValue(false);

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all main elements', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(
      screen.getByText('Double click on a file to see its information')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add file/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete current folder/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /edit current folder/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('files-component')).toBeInTheDocument();
  });

  it('shows mobile-specific text when on mobile device', () => {
    require('@/hooks/use-mobile').useIsMobile.mockReturnValue(true);

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(
      screen.getByText('Touch a file to see its information')
    ).toBeInTheDocument();
  });

  it('opens add file dialog when add file button is clicked', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    const addFileButton = screen.getByRole('button', { name: /add file/i });
    fireEvent.click(addFileButton);

    expect(screen.getByText('Upload a file')).toBeInTheDocument();
    expect(screen.getByTestId('add-file-form')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete folder button is clicked', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete current folder/i,
    });
    fireEvent.click(deleteButton);

    expect(
      screen.getByText(/are you sure you want to delete the current folder/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('opens edit folder dialog when edit folder button is clicked', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    const editButton = screen.getByRole('button', {
      name: /edit current folder/i,
    });
    fireEvent.click(editButton);

    expect(screen.getByText('Edit folder')).toBeInTheDocument();
    expect(screen.getByTestId('edit-file-category-form')).toBeInTheDocument();
  });

  it('handles delete folder confirmation', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Open delete dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete current folder/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmDeleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmDeleteButton);

    expect(mockDeleteMutate).toHaveBeenCalledWith(null);
  });

  it('handles delete dialog cancellation', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Open delete dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete current folder/i,
    });
    fireEvent.click(deleteButton);

    // Cancel deletion
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });

  it('sets up EventSource correctly', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(window.EventSource).toHaveBeenCalledWith(
      'http://localhost:3001/api/files/sse?token=mock-token'
    );
  });

  it('handles EventSource message correctly', async () => {
    const mockInvalidateQueries = jest
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue();

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Simulate EventSource message
    const messageData = JSON.stringify({
      message: 'File updated successfully',
    });
    const mockEvent = { data: messageData };

    if (mockEventSource.onmessage) {
      await mockEventSource.onmessage(mockEvent);
    }

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith('File updated successfully');
    });
  });

  it('handles EventSource error correctly', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Simulate EventSource error
    const mockError = new Error('EventSource error');

    if (mockEventSource.onerror) {
      mockEventSource.onerror(mockError);
    }

    expect(toast.error).toHaveBeenCalledWith('EventSource error');
  });

  it('closes EventSource on component unmount', () => {
    const { unmount } = render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    unmount();

    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it('calls setSession when user data is available', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(mockSetSession).toHaveBeenCalledWith(mockUser);
  });

  it('does not call setSession when user data is null', () => {
    (useGetCurrentUser as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('handles file category store with null category', () => {
    (useFileCategoryStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector.toString().includes('fileCategory')) return null;
        return null;
      }
    );

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(useDeleteFileCategory).toHaveBeenCalledWith('');
  });
});
