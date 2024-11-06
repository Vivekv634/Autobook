'use client';
import Menubar from '../../components/Sidebar';
import { useMediaHook } from '@/app/utils/mediaHook';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GlobalSearchDialog from '@/app/components/GlobalSearchDialog';

const LayoutComponent = ({ children }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <main className={cn(!isDesktop && 'h-screen', isDesktop && 'flex gap-1')}>
      <GlobalSearchDialog />
      <Menubar />
      <section
        className={cn(
          !isDesktop && 'mt-14',
          isDesktop && 'w-full h-screen p-3 border-box overflow-auto',
        )}
      >
        {children}
      </section>
    </main>
  );
};

export default LayoutComponent;
