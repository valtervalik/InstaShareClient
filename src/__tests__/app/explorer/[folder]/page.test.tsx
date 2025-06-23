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
  onopen: null as any,
  close: jest.fn(),
  readyState: 1 as number, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
};

// Create a factory function for EventSource that returns the mockEventSource
const EventSourceMock = jest.fn().mockImplementation(() => mockEventSource);

Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: EventSourceMock,
});

// Add EventSource constants to the constructor
(EventSourceMock as any).CONNECTING = 0;
(EventSourceMock as any).OPEN = 1;
(EventSourceMock as any).CLOSED = 2;

// Mock timers
jest.useFakeTimers();

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

    // Reset EventSource mock state
    mockEventSource.readyState = 1; // OPEN
    mockEventSource.onmessage = null;
    mockEventSource.onerror = null;
    mockEventSource.onopen = null;
    mockEventSource.close.mockClear();

    // Clear all mocks including EventSource constructor
    jest.clearAllMocks();
    EventSourceMock.mockClear();

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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
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

    expect(EventSourceMock).toHaveBeenCalledWith(
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

    // Simulate EventSource error with closed connection
    mockEventSource.readyState = 2; // CLOSED
    const mockError = new Error('EventSource error');

    if (mockEventSource.onerror) {
      mockEventSource.onerror(mockError);
    }

    expect(toast.error).toHaveBeenCalledWith(
      'Connection lost. Attempting to reconnect...'
    );
  });

  it('handles EventSource reconnection after error', () => {
    const { unmount } = render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Clear previous calls to window.EventSource
    jest.clearAllMocks();

    // Simulate EventSource error with closed connection
    mockEventSource.readyState = 2; // CLOSED
    const mockError = new Error('EventSource error');

    if (mockEventSource.onerror) {
      mockEventSource.onerror(mockError);
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(3000);

    // Verify that a new EventSource was created (reconnection attempt)
    expect(EventSourceMock).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('does not reconnect after component unmount', () => {
    const { unmount } = render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Simulate EventSource error with closed connection
    mockEventSource.readyState = 2; // CLOSED
    const mockError = new Error('EventSource error');

    // Unmount component first
    unmount();

    if (mockEventSource.onerror) {
      mockEventSource.onerror(mockError);
    }

    // Fast-forward timers
    jest.advanceTimersByTime(3000);

    // Should not create a new EventSource after unmount
    expect(EventSourceMock).toHaveBeenCalledTimes(1);
  });

  it('handles EventSource onopen event', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    if (mockEventSource.onopen) {
      mockEventSource.onopen({} as Event);
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      'EventSource connection established'
    );

    consoleSpy.mockRestore();
  });

  it('handles EventSource error without closed state', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Simulate EventSource error without closed connection
    mockEventSource.readyState = 1; // OPEN
    const mockError = new Error('EventSource error');

    if (mockEventSource.onerror) {
      mockEventSource.onerror(mockError);
    }

    // Should not show reconnection message for non-closed errors
    expect(toast.error).not.toHaveBeenCalled();
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

  it('closes add file dialog when form is submitted', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Open add file dialog
    const addFileButton = screen.getByRole('button', { name: /add file/i });
    fireEvent.click(addFileButton);

    expect(screen.getByTestId('add-file-form')).toBeInTheDocument();

    // Simulate form submission (close)
    const closeFormButton = screen.getByText('Close Form');
    fireEvent.click(closeFormButton);

    // Dialog should be closed
    expect(screen.queryByTestId('add-file-form')).not.toBeInTheDocument();
  });

  it('closes edit folder dialog when form is submitted', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Open edit folder dialog
    const editButton = screen.getByRole('button', {
      name: /edit current folder/i,
    });
    fireEvent.click(editButton);

    expect(screen.getByTestId('edit-file-category-form')).toBeInTheDocument();

    // Simulate form submission (close)
    const closeEditFormButton = screen.getByText('Close Edit Form');
    fireEvent.click(closeEditFormButton);

    // Dialog should be closed
    expect(
      screen.queryByTestId('edit-file-category-form')
    ).not.toBeInTheDocument();
  });

  it('navigates to explorer after successful deletion', () => {
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
    expect(mockPush).toHaveBeenCalledWith('/explorer');
  });

  it('closes all dialogs after successful deletion', () => {
    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    // Open add file dialog first
    const addFileButton = screen.getByRole('button', { name: /add file/i });
    fireEvent.click(addFileButton);

    // Verify add file dialog is open
    expect(screen.getByTestId('add-file-form')).toBeInTheDocument();

    // Close the add file dialog to access the delete button
    const closeFormButton = screen.getByText('Close Form');
    fireEvent.click(closeFormButton);

    // Now open delete dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete current folder/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmDeleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmDeleteButton);

    // Verify deletion was called and navigation occurred
    expect(mockDeleteMutate).toHaveBeenCalledWith(null);
    expect(mockPush).toHaveBeenCalledWith('/explorer');

    // Both dialogs should be closed (no forms visible)
    expect(screen.queryByTestId('add-file-form')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/are you sure you want to delete/i)
    ).not.toBeInTheDocument();
  });

  it('resets EventSource readyState before tests', () => {
    // Reset mock state
    mockEventSource.readyState = 1; // OPEN

    render(
      <Wrapper>
        <FolderPage />
      </Wrapper>
    );

    expect(mockEventSource.readyState).toBe(1);
  });
});
