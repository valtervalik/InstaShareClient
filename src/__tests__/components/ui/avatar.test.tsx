import { Avatar } from '@/components/ui/avatar';
import { render, screen } from '@testing-library/react';

describe('Avatar root', () => {
  it('renders Avatar root', () => {
    render(<Avatar data-testid='root' />);
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });
});
