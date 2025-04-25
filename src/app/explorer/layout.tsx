import { AppSidebar } from '@/components/layout/AppSideBar';
import SideBarTrigger from '@/components/layout/SideBarTrigger';
import { SidebarProvider } from '@/components/ui/sidebar';
import { client } from '@/http-client/client';
import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { User } from '@/interfaces/user/user.interface';
import { QueryKeys } from '@/queries/constants.enum';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

const ExplorerLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<FileCategory[], AxiosError>({
    queryKey: [QueryKeys.FILE_CATEGORIES_KEY],
    queryFn: () =>
      client.get('/files-categories').then((res) => res.data.elements),
  });

  await queryClient.prefetchQuery<User | null, AxiosError>({
    queryKey: [QueryKeys.CURRENT_USER_KEY],
    queryFn: () => client.get('/auth/current-user').then((res) => res.data),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SideBarTrigger />
        {children}
      </SidebarProvider>
    </HydrationBoundary>
  );
};

export default ExplorerLayout;
