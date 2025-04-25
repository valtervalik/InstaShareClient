'use client';
import { Folder, FolderPlus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useGetFileCategories } from '@/queries/hooks/explorer/file-category/useGetFileCategories';
import { useFileCategoryStore } from '@/store/useFileCategoryStore';
import { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import AddFileCategoryForm from '../explorer/file-category/AddFileCategoryForm';
import { NavLink } from '../ui/navlink';

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  const { data } = useGetFileCategories();
  const setFileCategory = useFileCategoryStore(
    (state) => state.setFileCategory
  );

  const isMobile = useIsMobile();

  return (
    <>
      <Sidebar className='z-10' variant='floating'>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>InstaShare</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => setOpen(true)}
                      className='py-1 px-2 rounded-md cursor-pointer bg-transparent text-[var(--color-primary)] text-xs self-end flex items-center'
                    >
                      <FolderPlus /> Add Folder
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {data?.map((item) => (
                  <SidebarMenuItem key={item._id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        onClick={() =>
                          setFileCategory({ name: item.name, _id: item._id })
                        }
                        activeClassName='bg-[var(--color-primary)]'
                        href={`/explorer/${item.name}`}
                      >
                        <div className='flex gap-2 items-center'>
                          <Folder />
                          <span>{item.name}</span>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What will be the name of the folder?</DialogTitle>
          </DialogHeader>
          <AddFileCategoryForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
