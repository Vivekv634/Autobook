'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase.config';

const RegisterComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    if (password && password.length < 8) {
      validationError =
        'Password must be alphanumeric and atleast 8 letters long';
    }
    setError(validationError);
  }, [email, dispatch, password]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const RegisterResponse = await axios.post(
        `${process.env.API}/api/register`,
        { name, email, password },
      );
      RegisterResponse.data.result &&
        toast({
          desciption: 'Registration successful! Now login.',
          className: 'bg-green-600',
        });
      router.push('/login');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      let message = 'Oops! something went wrong! Try again.';
      if (error.response.data.error.includes('email-already-in-use')) {
        message = 'Email already in use!';
      }
      toast({
        description: message,
        variant: 'destructive',
      });
    }
  };
  return (
    <main className="grid place-items-center h-screen">
      <Card className="w-11/12 md:w-3/12">
        <CardHeader className="text-center">
          <CardTitle>Welcome to AutoBook</CardTitle>
          <CardDescription>Take your notes more concisely.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                'Sign Up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="">
          <Label className="w-full text-center">
            Already have an account?{' '}
            <strong className="underline">
              <Link href="/login">Login here</Link>
            </strong>
          </Label>
        </CardFooter>
      </Card>
    </main>
  );
};

export default RegisterComponent;
