'use client';
import MobileSidebar from './MobileSidebar.jsx';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import DesktopSidebar from './DesktopSidebar.jsx';

const Menubar = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return <DesktopSidebar />;
  }

  return <MobileSidebar />;
};

export default Menubar;
