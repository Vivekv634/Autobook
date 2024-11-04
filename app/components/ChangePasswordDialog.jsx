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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useCustomToast } from './SendToast';
import { useSelector } from 'react-redux';

export default function ChangePasswordDialog({ open, setOpen }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
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
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-[18px] mr-1 my-auto animate-spin" />{' '}
                  Loading...
                </div>
              ) : (
                'Send Verification Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
