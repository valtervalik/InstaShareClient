import { Input } from '@/components/ui/input';
import { render, screen } from '@testing-library/react';

describe('Input', () => {
  it('renders with placeholder and accepts value', () => {
    render(<Input placeholder='Email' value='foo' onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input).toHaveValue('foo');
  });
});
