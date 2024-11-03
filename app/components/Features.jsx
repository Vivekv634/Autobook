'use client';
import React from 'react';
import { LayoutGrid } from '@/components/ui/layout-grid';
import { cards } from '../utils/pageData';

export function Features() {
  return (
    <div className="h-dvh w-full">
      <h2 className="md:text-5xl text-3xl lg:text-6xl font-bold text-center text-white">
        What makes AutoBook apart
      </h2>
      <LayoutGrid cards={cards} />
    </div>
  );
}
