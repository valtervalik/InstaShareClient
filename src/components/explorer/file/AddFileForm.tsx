'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadFile } from '@/queries/hooks/explorer/file/useUploadFile';
import { FileInputs, fileSchema } from '@/schemas/explorer/file/file.schema';
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

export default function AddFileForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const fileMutation = useUploadFile();
  const fileCategory = useFileCategoryStore((state) => state.fileCategory);

  const form = useForm<FileInputs>({
    resolver: zodResolver(fileSchema),
    defaultValues: { filename: '', category: fileCategory?._id },
  });

  const onSubmit: SubmitHandler<FileInputs> = (data) => {
    fileMutation.mutate(data);
    setOpen(false);
  };

  return fileCategory ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='filename'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input placeholder='Filename' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file'
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a folder' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={fileCategory._id}>
                    {fileCategory.name}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  ) : (
    <p>Select a folder to upload a file</p>
  );
}
