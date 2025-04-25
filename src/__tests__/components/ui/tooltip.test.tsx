class ResizeObserver {
  constructor(callback: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('renders trigger and content', async () => {
  render(
    <Tooltip>
      <TooltipTrigger>hover</TooltipTrigger>
      <TooltipContent>tip</TooltipContent>
    </Tooltip>
  );
  const trigger = screen.getByText('hover');
  expect(trigger).toBeInTheDocument();
  await userEvent.hover(trigger);
  const tooltips = await screen.findAllByRole('tooltip');
  expect(tooltips).toHaveLength(1);
});
