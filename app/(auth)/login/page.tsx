"use client";

import ButtonLoader from "@/components/app/ButtonLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/firebase.config";
import { loginUserProfile } from "@/redux/features/profile.features";
import { AppDispatch, RootState } from "@/redux/store";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      dispatch(loginUserProfile(form));
      if (error) return toast.error(error);

      if (user?.email) {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <section className="md:min-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    name="email"
                    placeholder="m@example.com"
                    onChange={(e) => handleFormChange(e)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    name="password"
                    onChange={(e) => handleFormChange(e)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <ButtonLoader
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                    label="Login"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
