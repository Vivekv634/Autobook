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
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function EditNotebookNameAlertDialog({
  children,
  notebookName,
  notebook_id,
  notesDocID,
}) {
  const [newNotebookName, setNewNotebookName] = useState(notebookName);
  const { toast } = useToast();

  async function handleSave() {
    try {
      await axios.put(
        `${process.env.API}/api/notebooks/update/${notebook_id}`,
        { notebookName: newNotebookName },
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      toast({
        description: 'Notebook name updated!',
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
          <AlertDialogTitle>Edit your title</AlertDialogTitle>
          <AlertDialogDescription>
            Edit your notebook title here. Save changes when you are done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
          required
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        />
        <AlertDialogFooter>
          <div className="flex justify-end items-center gap-2 *:h-full *:mt-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Save Changes
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
