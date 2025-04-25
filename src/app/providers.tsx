'use client';

import { Button } from '@/components/ui/button';
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { CircleX } from 'lucide-react';
import dynamic from 'next/dynamic';
import { closeSnackbar, SnackbarKey, SnackbarProvider } from 'notistack';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const action = (snackbarId: SnackbarKey) => (
  <>
    <Button
      className='bg-transparent hover:bg-transparent text-white cursor-pointer'
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <CircleX size={'lg'} />
    </Button>
  </>
);

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider action={action}>{children}</SnackbarProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
