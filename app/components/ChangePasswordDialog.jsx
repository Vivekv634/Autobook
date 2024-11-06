import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth } from '@/firebase.config';
import { cn } from '@/lib/utils';
import { updatePassword } from 'firebase/auth';
import { useState } from 'react';
import { useMediaHook } from '@/app/utils/mediaHook';
import { useCustomToast } from './SendToast';
import { useSelector } from 'react-redux';
import ButtonLoader from './ButtonLoader';

export default function ChangePasswordDialog({ open, setOpen }) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { user } = useSelector((state) => state.note);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const toast = useCustomToast();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    updatePassword(auth.currentUser, newPassword)
      .then(() => {
        setLoading(false);
        toast({
          description: 'Password reset email sent!',
          color: user?.userData?.theme,
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast({
          description: 'Oops! something went wrong. Try again.',
          variant: 'destructive',
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your email</DialogTitle>
          <DialogDescription>
            Change your present email to the new one. You will need to verify
            the new email address to complete the change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handlePasswordChange(e)}>
          <Input
            value={newPassword}
            placeholder="Your new password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="my-2"
            required
            type="password"
          />
          <DialogFooter>
            <DialogClose
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              className={cn(!isDesktop && 'my-2', 'font-semibold')}
            >
              <ButtonLoader loading={loading} label="Send Verification Email" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
