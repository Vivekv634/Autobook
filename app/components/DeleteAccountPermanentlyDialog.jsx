import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import fontClassifier from '../utils/font-classifier';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMediaHook } from '../utils/mediaHook';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '@/firebase.config';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';

export default function DeleteAccountPermanentlyDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [validationName, setValidationName] = useState('');
  const [deletionConfirmation, setDeletionConfirmation] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();

  useEffect(() => {
    setValid(
      validationName === user?.userData?.name &&
        deletionConfirmation === 'Delete my AutoBook account',
    );
  }, [validationName, user?.userData?.name, deletionConfirmation]);

  const resetForm = () => {
    setValidationName('');
    setDeletionConfirmation('');
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios
        .delete(`${process.env.API}/api/account/delete`, {
          headers: {
            userDocID: user?.userID,
            notesDocID: user?.userData?.notesDocID,
          },
        })
        .catch((error) => console.error(error))
        .then(() => {
          auth?.currentUser?.delete();
        })
        .then(() => {
          setLoading(true);
          toast({
            description: 'Your all data deleted!',
            color: user?.userData?.theme,
          });
          window.location.reload();
        });
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong.',
        variant: 'destructive',
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={fontClassifier(user?.userData?.font)}
        onInteractOutside={resetForm}
        onPointerDownOutside={resetForm}
        onEscapeKeyDown={resetForm}
        onCloseAutoFocus={resetForm}
      >
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This operation can not be undone. By continuing, your account and
            your all data will be deleted permanently.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => deleteAccount(e)}>
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              autoComplete="off"
              id="name"
              value={validationName}
              onChange={(e) => setValidationName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmation">Confirm Deletion</Label>
            <Input
              id="confirmation"
              autoComplete="off"
              value={deletionConfirmation}
              onChange={(e) => setDeletionConfirmation(e.target.value)}
              required
            />
            <Label
              htmlFor="confirmation"
              className="block mt-1 text-muted-foreground"
            >
              Write &apos;Delete my AutoBook account&apos; above to confirm the
              account deletion process.
            </Label>
          </div>
        </form>
        <DialogFooter>
          <DialogClose
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Cancel
          </DialogClose>
          <Button
            disabled={!valid || loading}
            variant="destructive"
            onClick={deleteAccount}
            className={cn(!isDesktop && 'my-2', 'font-semibold')}
          >
            <ButtonLoader loading={loading} label="Delete" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
