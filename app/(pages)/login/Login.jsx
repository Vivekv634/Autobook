'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '@/app/redux/slices/userLoginSlice';
import axios from 'axios';
import { isEmail } from 'validator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { hasCookie } from 'cookies-next';
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

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    let validationError = null;
    if (email && !isEmail(email)) {
      validationError = 'Invalid Email';
    }
    dispatch(loginFailure(validationError));
  }, [email, dispatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post(
        `${process.env.API}/api/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch(loginSuccess(response.data));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        description: error.message || 'An error occurred',
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
              className="w-full"
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

