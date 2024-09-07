'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '@/app/redux/slices/userLoginSlice';
import { isEmail } from 'validator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase.config';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.userLogin);

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
    }
    dispatch(loginFailure(validationError));
  }, [email, dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      signInWithEmailAndPassword(auth, email, password).then((data) => {
        dispatch(loginSuccess(data.user));
        toast({ description: 'Login Successful', className: 'bg-green-500' });
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong!',
        variant: 'destructive',
      });
      dispatch(loginFailure(null));
    }
  };

  return (
    <main className="grid place-items-center h-screen">
      <Card className="w-11/12 md:w-3/12">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Notesnook</CardTitle>
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
            <Label className="text-red-600 text-center">{error}</Label>
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isLoading || error}
            >
              {isLoading ? (
                <div className="flex">
                  <Loader2 className="h-[18px] animate-spin" /> Loading...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="">
          <Label className="w-full text-center">
            Don&apos;t have an account?{' '}
            <strong className="underline">
              <Link href="/register">Register here</Link>
            </strong>
          </Label>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginComponent;
