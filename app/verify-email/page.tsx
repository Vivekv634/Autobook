"use client";
import ButtonLoader from "@/components/app/ButtonLoader";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { auth } from "@/firebase.config";
import { onAuthStateChanged, sendEmailVerification, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (user.emailVerified) {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        toast.success("Verification email sent. Please check your inbox.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center flex-col text-center">
      <Card>
        <CardContent>
          <CardHeader className="text-3xl font-bold">
            Verify your email
          </CardHeader>
          <CardDescription className="text-md text-muted-foreground">
            Click on the below button to send the verification email.
          </CardDescription>

          <CardAction className="mt-10" onClick={sendVerificationEmail}>
            <ButtonLoader
              label={"Send Verification Email"}
              loading={loading}
              disabled={loading}
              loadingLabel={"Sending..."}
              className="w-full"
            />
          </CardAction>
        </CardContent>
      </Card>
    </section>
  );
}
