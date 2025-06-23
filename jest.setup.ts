// React and ReactDOM setup for tests
import * as ReactDOMClient from 'react-dom/client';

// jest-dom matchers
import '@testing-library/jest-dom';

// Provide ReactDOM.render using createRoot for tests
// Provide a utility function for rendering using createRoot for tests
const renderWithCreateRoot = (
  element: React.ReactElement,
  container: Element | DocumentFragment
) => {
  const root = ReactDOMClient.createRoot(container as HTMLElement);
  root.render(element);
};

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
