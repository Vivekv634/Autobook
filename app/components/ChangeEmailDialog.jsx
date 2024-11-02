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
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { auth } from '@/firebase.config';
import { Loader2 } from 'lucide-react';
import { useCustomToast } from './SendToast';
import { useSelector } from 'react-redux';

export default function ChangeEmailDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.note);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useCustomToast();

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password,
    );

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Send a verification email to the new email address
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

      toast({
        description:
          'A verification email has been sent to your new email address. Please verify it to complete the change.',
        color: user.userData.theme,
      });

      setLoading(false);
      setOpen(false);
      setNewEmail(''); // Clear the input field
    } catch (error) {
      setLoading(false);
      console.error('Error updating email:', error);
      toast({
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
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
        <form onSubmit={handleEmailChange}>
          <Input
            value={newEmail}
            placeholder="New Email Address"
            onChange={(e) => setNewEmail(e.target.value)}
            className="my-2"
            required
            type="email"
          />
          <Input
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
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
            <Button type="submit">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-[18px] animate-spin" /> Loading...
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
