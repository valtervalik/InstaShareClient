'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import { FolderSymlink } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

const SideBarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return isMobile ? (
    <Button
      onClick={toggleSidebar}
      variant={'outline'}
      className='fixed top-23 left-0'
    >
      <FolderSymlink size={10} />
    </Button>
  ) : (
    <></>
  );
};

export default SideBarTrigger;
