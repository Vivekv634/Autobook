'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { isStrongPassword, isEmail } from 'validator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/components/ui/use-toast';

const RegisterComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.userRegister);
  const { toast } = useToast();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    let validationError = null;
    if (email && !isEmail(email)) {
      validationError = 'Email must be valid';
    }
    if (password && !isStrongPassword(password) && password.length < 8) {
      validationError = 'Password must be min 8 characters and alphanumeric';
    }
    dispatch(registerFailure(validationError));
  }, [email, password, dispatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerStart());
    try {
      const response = await axios.post(
        `${process.env.API}/api/register`,
        { name, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      toast({
        description: 'Registration successful! Now login to use app.',
        className: 'bg-green-400',
      });
      dispatch(registerSuccess(response.data));
    } catch (error) {
      toast({
        description: error.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
      dispatch(registerFailure(null));
    }
  };

  return (
    <main className="grid place-items-center h-screen">
      <Card className="w-11/12 md:w-3/12">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Notesnook</CardTitle>
          <CardDescription>Take notes more concisely.</CardDescription>
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
              className="w-full"
              disabled={isLoading || error ? true : false}
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
        <CardFooter>
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
