'use client';
import { useEditFile } from '@/queries/hooks/explorer/file/useEditFile';
import { FileInputs, fileSchema } from '@/schemas/explorer/file/file.schema';
import { useFileStore } from '@/store/useFileStore';
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

export default function EditFileForm({
  setOpen,
  setOpenEdit,
  id,
}: {
  setOpen: (open: boolean) => void;
  setOpenEdit: (open: boolean) => void;
  id: string;
}) {
  const fileMutation = useEditFile(id);
  const file = useFileStore((state) => state.file);

  const form = useForm<Pick<FileInputs, 'filename'>>({
    resolver: zodResolver(fileSchema.pick({ filename: true })),
    defaultValues: { filename: file.filename.split('.')[0] },
  });

  const onSubmit: SubmitHandler<Pick<FileInputs, 'filename'>> = (data) => {
    fileMutation.mutate(data);
    setOpen(false);
    setOpenEdit(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='filename'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input placeholder='New filename' {...field} />
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
