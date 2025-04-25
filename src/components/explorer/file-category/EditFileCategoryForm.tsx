'use client';
import { useEditFileCategory } from '@/queries/hooks/explorer/file-category/useEditFileCategory';
import {
  FileCategoryInputs,
  fileCategorySchema,
} from '@/schemas/explorer/file-category/file-category.schema';
import { useFileCategoryStore } from '@/store/useFileCategoryStore';
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

export default function EditFileCategoryForm({
  setOpen,
  setOpenEdit,
  id,
}: {
  setOpen: (open: boolean) => void;
  setOpenEdit: (open: boolean) => void;
  id: string;
}) {
  const fileMutation = useEditFileCategory(id);
  const category = useFileCategoryStore((state) => state.fileCategory);

  const form = useForm<FileCategoryInputs>({
    resolver: zodResolver(fileCategorySchema),
    defaultValues: { name: category?.name || '' },
  });

  const onSubmit: SubmitHandler<FileCategoryInputs> = (data) => {
    fileMutation.mutate(data);
    setOpen(false);
    setOpenEdit(false);
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
                <Input placeholder='New folder name' {...field} />
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
