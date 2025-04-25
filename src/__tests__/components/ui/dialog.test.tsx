import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Dialog', () => {
  it('renders trigger and content', () => {
    render(
      <Dialog>
        <DialogTrigger>show</DialogTrigger>
        <DialogContent>modal</DialogContent>
      </Dialog>
    );
    const trigger = screen.getByText('show');
    fireEvent.click(trigger);
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('modal')).toBeInTheDocument();
  });
});
