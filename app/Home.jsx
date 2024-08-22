'use client';
import React, { useEffect, useState } from 'react';
import '@/app/globals.css';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/userLoginSlice';
import Link from 'next/link';
import { getCookie, hasCookie } from 'cookies-next';
import { Button, buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const HomeComponent = () => {
  const dispatch = useDispatch();
  const [cookie, setCookie] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      setCookie(getCookie('user-session-data'));
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const Logout = () => {
    dispatch(logout());
    window.location.reload();
  };
  return (
    <>
      <main className="container m-auto *:p-0 *:m-0">
        <section className="flex gap-2 items-center justify-center">
          {cookie && (
            <Button onClick={Logout} variant="outline">
              Logout
            </Button>
          )}
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
