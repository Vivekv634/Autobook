'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmail } from 'validator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useCustomToast } from '@/app/components/SendToast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ButtonLoader from '@/app/components/ButtonLoader';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useCustomToast();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  useEffect(() => {
    let validationError = null;
    if (email && !isEmail(email)) {
      validationError = 'Invalid Email';
    } else {
      validationError = null;
    }
    setError(validationError);
  }, [email, dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({ description: 'Login Successful', color: 'green' });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          description: 'Oops! something went wrong!',
          variant: 'destructive',
        });
        setLoading(false);
      });
  };
  const handleResetPassword = async () => {
    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ description: 'Check your email inbox!', color: 'green' });
      setResetLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong!',
        variant: 'destructive',
      });
      setResetLoading(false);
    }
  };

  const resetForm = () => {
    setResetEmail('');
  };

  return (
    <main className="grid place-items-center h-screen">
      <Dialog>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome to AutoBook</CardTitle>
            <CardDescription>Write notes in the way you want.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Label
                className={cn('text-red-600 text-center', !error && 'hidden')}
              >
                {error}
              </Label>
              <Label className="flex justify-end underline hover:no-underline font-semibold my-1">
                <DialogTrigger>
                  <span>Forgot password?</span>
                </DialogTrigger>
              </Label>
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loading || error}
              >
                <ButtonLoader loading={loading} label="Sign in" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Label className="w-full text-center">
              Don&apos;t have an account?{' '}
              <strong className="underline font-semibold hover:no-underline">
                <Link href="/register">Register here</Link>
              </strong>
            </Label>
          </CardFooter>
        </Card>
        <DialogContent
          onInteractOutside={resetForm}
          onPointerDownOutside={resetForm}
          onEscapeKeyDown={resetForm}
          onCloseAutoFocus={resetForm}
        >
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <Input
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            autoComplete="off"
            placeholder="Email address"
          />
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'secondary' })}>
              Cancel
            </DialogClose>
            <Button
              disabled={resetLoading || resetEmail.trim() === ''}
              onClick={handleResetPassword}
              className="flex font-semibold items-center"
            >
              <ButtonLoader loading={resetLoading} label="Reset Password" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default LoginComponent;
