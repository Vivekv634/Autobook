'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCustomToast } from './SendToast';
import { useSelector } from 'react-redux';
import ButtonLoader from './ButtonLoader';

export default function EditNotebookNameAlertDialog({
  children,
  notebookName,
  notebook_id,
  notesDocID,
  notebooks,
}) {
  const [newNotebookName, setNewNotebookName] = useState(notebookName);
  const [newNotebookPreview, setNewNotebookPreview] = useState('');
  const [notebookNameError, setNotebookNameError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  useEffect(() => {
    if (newNotebookName.trim() === notebookName) {
      setNotebookNameError(' ');
      return;
    }
    if (
      Object.values(notebooks)
        .map((notebook) => notebook.notebookName)
        .includes(newNotebookName.trim())
    ) {
      setNotebookNameError(
        <span>
          <span className="font-bold">{newNotebookName}</span> notebook already
          exists!
        </span>,
      );
    } else {
      setNotebookNameError(null);
    }

    setNewNotebookPreview(
      newNotebookName
        .split(' ')
        .map((word) => word.trim())
        .join(' '),
    );
  }, [setNotebookNameError, newNotebookName, notebooks, notebookName]);

  async function handleSave(e) {
    try {
      e.preventDefault();
      setLoading(true);
      let notebookBody = {
        notebookName: newNotebookName
          .split(' ')
          .filter((word) => word !== '')
          .join(' '),
      };
      await axios.put(
        `${process.env.API}/api/notebooks/update/${notebook_id}`,
        notebookBody,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      toast({
        description: (
          <span>
            <span className="font-bold">{notebookName}</span> notebook updated!
          </span>
        ),
        color: user?.userData?.theme,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  return (
    <AlertDialog onClick={(e) => e.stopPropagation()}>
      <AlertDialogTrigger
        className="flex justify-between w-44 pr-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit your notebook</AlertDialogTitle>
          <AlertDialogDescription>
            Edit your notebook name here. Save changes when you are done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={(e) => handleSave(e)}>
          <Input
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            required
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="my-2"
          />
          <Label className={cn('text-red-400', !notebookNameError && 'hidden')}>
            {notebookNameError}
          </Label>
          <Label
            className={cn(
              (notebookNameError || newNotebookName.trim() == '') && 'hidden',
              'my-1 font-semibold',
            )}
          >
            Preview: {newNotebookPreview}
          </Label>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-semibold"
              disabled={loading || notebookNameError}
              type="submit"
            >
              <ButtonLoader loading={loading} label="Save Changes" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
