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
import { registerUser } from "@/redux/features/profile.features";
import { AppDispatch, RootState } from "@/redux/store";
import { RegisterUserType } from "@/types/Register.types";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterUserType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const res = await dispatch(registerUser(form));

      if (res.meta.requestStatus === "rejected") {
        console.error(res.payload);
        toast.error(res.payload as string);
        return;
      } else if (res.meta.requestStatus === "fulfilled") {
        console.log(res.payload);
        router.push("/login");
        toast.success("Registration successful! Please login.");
      }
    } catch (error) {
      toast.error(error as string);
    }
  }
  return (
    <main className="flex justify-center items-center h-screen">
      <section className="md:min-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Register form</CardTitle>
            <CardDescription>
              Enter your credentials below to register.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="Name">Name</Label>
                  <Input
                    id="Name"
                    value={form.name}
                    name="name"
                    placeholder="John Doe"
                    onChange={(e) => handleFormChange(e)}
                    required
                  />
                </div>
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
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="cpassword">Confirm password</Label>
                  </div>
                  <Input
                    id="cpassword"
                    type="password"
                    value={form.confirmPassword}
                    name="confirmPassword"
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
                    label="Register"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        {JSON.stringify(form)}
      </section>
    </main>
  );
}
