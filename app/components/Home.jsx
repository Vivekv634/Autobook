import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function SpotlightHome() {
  return (
    <div className="py-4 h-dvh w-full flex items-center flex-col antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <nav className="flex container justify-between">
        <Link href="/" className="text-xl my-auto font-semibold">
          AutoBook
        </Link>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href="/register"
        >
          Sign up
        </Link>
      </nav>
      <Separator className="md:hidden mt-2" />
      <div className="px-4 my-32 text-center mx-auto relative z-10 w-full pt-20">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Stay Organized,
          <br /> Automate Your Notes with AutoBook
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg mx-auto">
          AutoBook simplifies note-taking by automating entries, sending timely
          reminders, and ensuring you never miss a moment.
        </p>
        <div className="my-3">
          <Button asChild>
            <Link href="/login" className="bg-neutral-100 mr-2">
              Get Started
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
