'use client';
import React from 'react';
import '@/app/globals.css';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { auth } from '@/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const HomeComponent = () => {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/dashboard');
    }
  });

  const Logout = () => {
    auth.signOut();
  };

  return (
    <>
      <main className="container m-auto *:p-0 *:m-0">
        <section className="flex gap-2 items-center justify-center">
          <Button onClick={Logout} variant="outline">
            Logout
          </Button>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/register"
          >
            <button>Register</button>
          </Link>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/login"
          >
            <button>Login</button>
          </Link>
        </section>
      </main>
    </>
  );
};

export default HomeComponent;
