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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { useCustomToast } from './SendToast';

export default function EditUserNameDialog({ open, setOpen }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
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
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-[18px] mr-1 my-auto animate-spin" />{' '}
                  Loading...
                </div>
              ) : (
                'Change Name'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
