'use client';
import { useGetCurrentUser } from '@/queries/hooks/user/useGetCurrentUser';

import { usesessionStore } from '@/store/useSessionStore';

import { useEffect } from 'react';

const ExplorerPage = () => {
  const { data } = useGetCurrentUser();
  const setSession = usesessionStore((state) => state.setSession);
  const currentUser = useGetCurrentUser();

  useEffect(() => {
    if (data) {
      setSession(data);
    }
  }, [data]);

  return (
    <section className='w-full h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center'>
        <h2 className='text-xl'>
          Welcome to Instashare{' '}
          <span className='text-[var(--primary)]'>
            {currentUser.data?.email}
          </span>
        </h2>
        <p className='text-gray-400 dark:text-[var(--secondary)]'>
          You can create folders to organize your files in the sidebar at the
          left of the screen
        </p>
      </div>
    </section>
  );
};

export default ExplorerPage;
