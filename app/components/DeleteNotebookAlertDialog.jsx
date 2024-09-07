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
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function DeleteNotebookAlertDialog({
  children,
  notebook_id,
  notesDocID,
}) {
  const { notebooks, autoNotes } = useSelector((state) => state.note);
  const { toast } = useToast();
  const [anName] = useState(
    autoNotes?.map((autoNote) => {
      if (autoNote.autoNoteNotebookID === notebook_id) {
        return autoNote.autoNoteName;
      }
    }),
  );

  async function handleDelete() {
    try {
      await axios.delete(
        `${process.env.API}/api/notebooks/delete/${notebook_id}`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      toast({
        description: (
          <span>
            <span className="font-semibold">
              {notebooks[notebook_id].notebookName}
            </span>{' '}
            notebook deleted
          </span>
        ),
        className: 'bg-green-500',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  }

  return (
    <AlertDialog onClick={(e) => e.stopPropagation()}>
      <AlertDialogTrigger
        className="text-red-400 flex justify-between w-44 pr-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </AlertDialogTrigger>
      {notebooks[notebook_id].usedInTemplate ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Can&apos;t delete notebook</AlertDialogTitle>
            <AlertDialogDescription>
              Cannot delete this notebook because this notebook is used in the
              <span className="font-bold px-1 inline-block underline">
                {anName}
              </span>
              Auto Note. If you want to delete
              <span className="font-bold px-1 inline-block underline">
                {notebooks[notebook_id].notebookName}
              </span>
              notebook, then change the
              <span className="font-bold px-1 inline-block underline">
                {anName}&apos;s
              </span>
              notebook and then you can delete the delete this notebook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This operation cannot be reverse. This will permanently delete the
              <span className="font-bold px-1">
                {notebooks[notebook_id]?.notebookName}
              </span>
              notebook, but doesn&apos;t delete your notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={cn(buttonVariants({ variant: 'destructive' }))}
            >
              Delete Notebook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
