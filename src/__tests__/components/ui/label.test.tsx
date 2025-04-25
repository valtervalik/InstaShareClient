import { Label } from '@/components/ui/label';
import { render, screen } from '@testing-library/react';

describe('Label', () => {
  it('renders children and htmlFor', () => {
    render(<Label htmlFor='id'>Name</Label>);
    const label = screen.getByText('Name');
    expect(label).toHaveAttribute('for', 'id');
  });
});
