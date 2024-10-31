import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { auth } from '@/firebase.config';
import { Button } from '@/components/ui/button';

export default function LogOutAlertDialog({ children, className }) {
  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
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
