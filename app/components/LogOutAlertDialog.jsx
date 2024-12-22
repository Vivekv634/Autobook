import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { auth } from "@/firebase.config";
import { Button } from "@/components/ui/button";
import fontClassifier from "../utils/font-classifier";
import { useSelector } from "react-redux";

export default function LogOutAlertDialog({ children, className }) {
  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };
  const { user } = useSelector((state) => state.note);

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>{children}</AlertDialogTrigger>
      <AlertDialogContent className={fontClassifier(user?.userData?.font)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={LogOut} variant="destructive">
            Logout
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
