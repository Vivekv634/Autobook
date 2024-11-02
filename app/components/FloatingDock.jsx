import React from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import { floatingDockLinks } from '../utils/pageData';

export function FloatingDockHome() {
  return (
    <div className="flex items-center justify-center">
      <FloatingDock items={floatingDockLinks} />
    </div>
  );
}
