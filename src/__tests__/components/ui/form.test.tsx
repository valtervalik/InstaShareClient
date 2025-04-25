import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

describe('Form primitives', () => {
  it('renders label and control', () => {
    const Wrapper = () => {
      const methods = useForm<{ name: string }>();
      return (
        <Form {...methods}>
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <input />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Form>
      );
    };
    render(<Wrapper />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
