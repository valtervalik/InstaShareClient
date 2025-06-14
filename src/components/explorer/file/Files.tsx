'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { client } from '@/http-client/client';
import type { File as FileModel } from '@/interfaces/explorer/file/file.interface';
import { FileStatusEnum } from '@/lib/constants/files.enum';
import { useDeleteFile } from '@/queries/hooks/explorer/file/useDeleteFile';
import { useGetFilesByCategory } from '@/queries/hooks/explorer/file/useGetFilesByCategory';
import { useFileCategoryStore } from '@/store/useFileCategoryStore';
import { useFileStore } from '@/store/useFileStore';
import { DialogDescription } from '@radix-ui/react-dialog';
import byteSize from 'byte-size';
import { File } from 'lucide-react';
import { useState } from 'react';
import EditFileForm from './EditFileForm';

const Files = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const isMobile = useIsMobile();
  const [lastClickTime, setLastClickTime] = useState(0);
  const handleClick = (fileItem: FileModel) => {
    const now = Date.now();
    if (isMobile || now - lastClickTime < 300) {
      setFile(fileItem);
      setOpen(true);
    }
    setLastClickTime(now);
  };
  const fileCategory = useFileCategoryStore((state) => state.fileCategory);
  const setFile = useFileStore((state) => state.setFile);
  const file = useFileStore((state) => state.file);

  const { data } = useGetFilesByCategory(fileCategory?._id || '');
  const deleteFile = useDeleteFile(file._id);

  // download handler for files
  const handleDownload = async () => {
    try {
      const response = await client.get(`/files/download/${file._id}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const downloadName = file.ref.split('/')[1];
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div>
      {data?.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 auto-cols-fr grid-rows-6 gap-3'>
          {data.map((file: FileModel) => (
            <div
              key={file._id}
              onClick={() => handleClick(file)}
              className='p-2 flex flex-col items-center gap-2 cursor-pointer'
            >
              <File size={50} />
              <p className='text-xs font-bold'>{file.filename}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
          <p className='text-2xl text-gray-400 dark:text-[var(--secondary)]'>
            Folder empty
          </p>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{file.filename}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Size: {byteSize(file.size).value} {byteSize(file.size).unit}
          </DialogDescription>
          <DialogDescription>Status: {file.status}</DialogDescription>
          {file.status === FileStatusEnum.COMPRESSED && (
            <DialogDescription>
              Compressed Size: {byteSize(file.compressedSize).value}{' '}
              {byteSize(file.compressedSize).unit}
            </DialogDescription>
          )}
          <DialogFooter>
            <Button onClick={handleDownload}>Download</Button>
            <Button onClick={() => setOpenEdit(true)} variant='outline'>
              Edit
            </Button>
            <Button
              onClick={() => setOpenDelete(true)}
              className='text-red-500'
              variant='outline'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit file</DialogTitle>
          </DialogHeader>
          <EditFileForm
            setOpen={setOpen}
            setOpenEdit={setOpenEdit}
            id={file._id}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this file?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              className='text-red-500'
              variant={'outline'}
              onClick={() => {
                deleteFile.mutate(null);
                setOpenDelete(false);
                setOpen(false);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setOpenDelete(false)} variant='outline'>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Files;
