import { NavLink } from '@/components/ui/navlink';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));

describe('NavLink', () => {
  beforeEach(() => (usePathname as jest.Mock).mockReturnValue('/foo'));
  it('applies activeClassName when path matches', () => {
    render(
      <NavLink href='/foo' activeClassName='active'>
        <a>Link</a>
      </NavLink>
    );
    expect(screen.getByText('Link')).toHaveClass('active');
  });
});
