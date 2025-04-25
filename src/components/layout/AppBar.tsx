'use client';
import { client } from '@/http-client/client';
import { usesessionStore } from '@/store/useSessionStore';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider } from '../ui/tooltip';

const AppBar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const setSession = usesessionStore((state) => state.setSession);
  const session = usesessionStore((state) => state.session);

  return (
    <section className='fixed top-0 left-0 w-full p-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>InstaShare</h2>
        {session ? (
          <div className='flex items-center gap-2 cursor-pointer'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarFallback className='bg-[var(--color-primary)] text-[var(--foreground)]'>
                      {session.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className='text-[var(--foreground)]'>{session.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <LogOut
              onClick={() => {
                client
                  .get('/auth/logout', { withCredentials: true })
                  .then((res) => {
                    enqueueSnackbar(res.data.message, { variant: 'success' });
                    queryClient.invalidateQueries({
                      refetchType: 'all',
                    });
                    setSession(null);
                    router.push('/login');
                  });
              }}
            />
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Link href='/sign-up'>
              <Button className='text-[var(--foreground)] cursor-pointer'>
                Sign Up
              </Button>
            </Link>
            <Link href='/login'>
              <Button className='cursor-pointer' variant={'outline'}>
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppBar;
