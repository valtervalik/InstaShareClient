'use client';
import EditFileCategoryForm from '@/components/explorer/file-category/EditFileCategoryForm';
import AddFileForm from '@/components/explorer/file/AddFileForm';
import Files from '@/components/explorer/file/Files';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { QueryKeys } from '@/queries/constants.enum';
import { useDeleteFileCategory } from '@/queries/hooks/explorer/file-category/useDeleteFileCategory';
import { useGetUpdatedUploadStatus } from '@/queries/hooks/explorer/file/useGetUpdatedUploadStatus';
import { useGetCurrentUser } from '@/queries/hooks/user/useGetCurrentUser';
import { useFileCategoryStore } from '@/store/useFileCategoryStore';
import { useFileStore } from '@/store/useFileStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useQueryClient } from '@tanstack/react-query';
import { FilePlus, FolderPen, FolderX, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const FolderPage = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const jobId = useFileStore((state) => state.jobId);
  const setJobId = useFileStore((state) => state.setJobId);
  const { data: uploadStatus } = useGetUpdatedUploadStatus(jobId);
  const { data } = useGetCurrentUser();
  const setSession = useSessionStore((state) => state.setSession);
  const fileCategory = useFileCategoryStore((state) => state.fileCategory);
  const deleteCategory = useDeleteFileCategory(fileCategory?._id || '');

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (uploadStatus) {
      enqueueSnackbar(`Progress: ${uploadStatus.data.progress}%`, {
        variant: 'info',
      });
      if (uploadStatus.data.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.FILES_KEY] });
        enqueueSnackbar(`Upload ${uploadStatus.data.status}`, {
          variant: 'success',
        });
        setJobId(null);
      } else if (uploadStatus.data.status === 'failed') {
        enqueueSnackbar(uploadStatus.message, {
          variant: 'error',
        });
        setJobId(null);
      }
    }
  }, [uploadStatus, queryClient, setJobId]);

  useEffect(() => {
    if (data) {
      setSession(data);
    }
  }, [data, setSession]);

  return (
    <section className=' pt-20 w-full'>
      <div className='p-3 flex md:flex-row flex-col items-center justify-between w-full px-12'>
        <div className='text-[var(--color-primary)] flex gap-2 items-center'>
          <Info size={20} />
          {isMobile ? (
            <p className='text-xs'>Touch a file to see its information</p>
          ) : (
            <p>Double click on a file to see its information</p>
          )}
        </div>
        <div className='flex gap-2 sm:flex-row flex-col'>
          <Button onClick={() => setOpen(true)} variant={'outline'}>
            <FilePlus />
            Add file
          </Button>
          <Button
            className='text-red-500'
            onClick={() => setOpenDelete(true)}
            variant={'outline'}
          >
            <FolderX />
            Delete current folder
          </Button>
          <Button
            className='text-amber-500'
            onClick={() => setOpenEdit(true)}
            variant={'outline'}
          >
            <FolderPen />
            Edit current folder
          </Button>
        </div>
      </div>
      <Files />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a file</DialogTitle>
          </DialogHeader>
          <AddFileForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the current folder? This action
              cannot be undone. Files inside the folder will also be deleted.
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              className='text-red-500'
              variant={'outline'}
              onClick={() => {
                deleteCategory.mutate(null);
                setOpenDelete(false);
                setOpen(false);
                router.push('/explorer');
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
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit folder</DialogTitle>
          </DialogHeader>
          <EditFileCategoryForm
            setOpen={setOpen}
            setOpenEdit={setOpenEdit}
            id={fileCategory?._id || ''}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FolderPage;
