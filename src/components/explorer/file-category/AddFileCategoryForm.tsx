'use client';
import { useAddFileCategory } from '@/queries/hooks/explorer/file-category/useAddFileCategory';
import {
  FileCategoryInputs,
  fileCategorySchema,
} from '@/schemas/explorer/file-category/file-category.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';

export default function AddFileCategoryForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const fileCategoryMutation = useAddFileCategory();

  const form = useForm<FileCategoryInputs>({
    resolver: zodResolver(fileCategorySchema),
    defaultValues: { name: '' },
  });

  const onSubmit: SubmitHandler<FileCategoryInputs> = (data) => {
    fileCategoryMutation.mutate(data);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  );
}
