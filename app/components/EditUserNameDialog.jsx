'use client';
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
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';
import fontClassifier from '../utils/font-classifier';

export default function EditUserNameDialog({ open, setOpen }) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState(user?.userData?.name ?? '');

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = { name: newName };
      await axios.put(
        `${process.env.API}/api/account/update/${user.userID}`,
        body,
        { headers: { notesDocID: user?.userData?.notesDocID } },
      );
      toast({ description: 'Name updated!', color: user?.userData?.theme });
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setNewName(user?.userData?.name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={resetForm}
        onPointerDownOutside={resetForm}
        onEscapeKeyDown={resetForm}
        onCloseAutoFocus={resetForm}
        className={fontClassifier(user?.userData?.font)}
      >
        <DialogHeader>
          <DialogTitle>Change your name</DialogTitle>
          <DialogDescription>
            Change your name for the app. Save changes when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNameChange}>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Your name..."
            className="my-2"
          />
          <DialogFooter>
            <DialogClose
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </DialogClose>
            <Button
              disabled={loading}
              type="submit"
              className={cn(!isDesktop && 'my-2', 'font-semibold')}
            >
              <ButtonLoader loading={loading} label="Change Name" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
