'use client';
import React from 'react';
import '@/app/globals.css';
import { GlobeHome } from '@/app/components/GlobeHome';
import { FloatingDockHome } from './components/FloatingDock';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/firebase.config';

const HomeComponent = () => {
  const Logout = () => {
    auth.signOut();
  };
  return (
    <>
      <main className="md:container h-screen mx-auto *:p-0 *:m-0">
        <Button onClick={Logout} variant="outline">
          Logout
        </Button>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href="/register"
        >
          <button>Register</button>
        </Link>
        <Link className={buttonVariants({ variant: 'outline' })} href="/login">
          <button>Login</button>
        </Link>
        <div className="fixed flex justify-center w-full left-0 z-50 bottom-3">
          <FloatingDockHome />
        </div>
        <section className="my-5" id="home">
          <GlobeHome />
        </section>
      </main>
    </>
  );
};

export default HomeComponent;
