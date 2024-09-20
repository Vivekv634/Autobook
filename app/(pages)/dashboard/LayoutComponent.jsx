'use client';
import Menubar from '../../components/Sidebar';
import { useMediaQuery } from 'usehooks-ts';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const LayoutComponent = ({ children }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <main className={cn(!isDesktop && 'h-screen', isDesktop && 'flex gap-1')}>
      <Menubar />
      <section
        className={cn(
          isDesktop &&
            'w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-3 border-box overflow-auto',
        )}
      >
        {children}
      </section>
    </main>
  );
};

export default LayoutComponent;
