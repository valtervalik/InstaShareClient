import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Select', () => {
  it('renders trigger, value placeholder and items', async () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();

    render(
      <Select>
        <SelectTrigger>open</SelectTrigger>
        <SelectValue placeholder='Choose' />
        <SelectContent>
          <SelectItem value='a'>A</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Choose')).toBeInTheDocument();

    // open the select so items are rendered
    // Setup userEvent to skip pointer event checks which cause errors in JSDOM
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    // Click the trigger to open the select dropdown
    const trigger = screen.getByText('open');
    (trigger as any).hasPointerCapture = () => false;
    await user.click(trigger);
    expect(screen.getByText('Choose')).toBeInTheDocument();
    expect(
      await screen.findByRole('option', { name: 'A' })
    ).toBeInTheDocument();
  });
});
