'use client';
import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { globeConfig, sampleArcs } from '../utils/pageData';

const World = dynamic(
  () => import('@/components/ui/globe').then((m) => m.World),
  {
    ssr: false,
  },
);

export function GlobeHome() {
  return (
    <div className="flex flex-row items-center justify-center my-28 h-screen md:h-auto bg-inherit relative w-full">
      <div className="mx-auto w-full relative overflow-hidden h-full md:h-[40rem] md:px-4 px-1">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-center text-xl md:text-4xl font-bold z-50 text-black dark:text-white">
            Stay Organized, Automate Your Notes with AutoBook
          </h2>
          <p className="text-center text-base md:text-lg z-50 font-normal text-neutral-700 dark:text-neutral-200 max-w-2xl mt-2 mx-auto">
            AutoBook simplifies note-taking by automating entries, sending
            timely reminders, and ensuring you never miss a moment.
          </p>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        <div className="absolute w-full bottom-2 md:-bottom-14 h-screen md:h-full -z-10">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
