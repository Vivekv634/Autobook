'use client';
import Menubar from '../../components/Sidebar';
import { useMediaQuery } from 'usehooks-ts';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const LayoutComponent = ({ children }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) {
    return null;
  }

  if (isDesktop) {
    return (
      <main className="flex gap-1">
        <Menubar />
        <div className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md p-3 border-box overflow-auto">
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen">
      <Menubar />
      <section>
        {children}
        <div className="fixed w-full border-t bottom-0 p-4">
          <div className="flex justify-center items-center gap-1">
            Made with <Heart className="text-red-400" /> by
            <Link
              target="_blank"
              className="underline font-bold"
              href="https://github.com/Vivekv634"
            >
              @Vivekv634
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LayoutComponent;
