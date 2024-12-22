import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaHook } from "@/app/utils/mediaHook";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useCustomToast } from "./SendToast";
import { useSelector } from "react-redux";
import ButtonLoader from "./ButtonLoader";
import fontClassifier from "../utils/font-classifier";

export default function VerifyEmailDialog({ open, setOpen }) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  const sendVerificationEmail = () => {
    setLoading(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setLoading(false);
        toast({
          description: "Verification Email sent!",
          color: user?.userData?.theme,
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast({
          description: "Oops! something went wrong. Try again!",
          variant: "destructive",
        });
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={fontClassifier(user?.userData?.font)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Email</AlertDialogTitle>
          <AlertDialogDescription>
            Verify your email address to use the app at full power.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={sendVerificationEmail}
            disabled={loading}
            type="submit"
            className={cn(!isDesktop && "my-2", "font-semibold")}
          >
            <ButtonLoader loading={loading} label="Send Email" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
