import { Button, buttonVariants } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/firebase.config';
import { cn } from '@/lib/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import VerifyEmailTemplate from './VerifyEmailTemplate';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';

const NewNotebookDialog = ({ setOpen }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const { notebooks, user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  useEffect(() => {
    const notebookNames = Object.values(notebooks).map((notebook) => {
      return notebook.notebookName;
    });
    if (notebookNames.includes(newNotebookName.trim())) {
      setError(`${newNotebookName} notebook is already exists!`);
    } else {
      setError(null);
    }
  }, [newNotebookName, notebooks]);

  const handleCreateNewNotebook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${process.env.API}/api/notebooks/create`,
        { notebookName: newNotebookName },
        { headers: { notesDocID: user?.userData?.notesDocID } },
      );
      setLoading(false);
      setNewNotebookName('');
      setOpen(false);
      toast({
        description: (
          <span>
            <span className="font-bold">{newNotebookName}</span> notebook
            created successfully!
          </span>
        ),
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  if (!auth.currentUser?.emailVerified) return <VerifyEmailTemplate />;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Notebook</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => handleCreateNewNotebook(e)}>
        <Input
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
          required
          placeholder="Notebook Name"
          className="mb-2"
        />
        <Label className="text-red-400">{error}</Label>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'secondary' })}>
            Cancel
          </DialogClose>
          <Button
            className={cn(!isDesktop && 'my-2', 'font-semibold')}
            disabled={error || loading}
            type="submit"
          >
            <ButtonLoader loading={loading} label="Create Notebook" />
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewNotebookDialog;
