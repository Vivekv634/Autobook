'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useMediaHook } from '@/app/utils/mediaHook';
import axios from 'axios';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';
import fontClassifier from '../utils/font-classifier';

export default function DeleteNotebookDialog({
  open,
  setOpen,
  notebook_id,
  notebookName,
  isDropDownMenuOpen,
}) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { notebooks, autoNotes, notes, user } = useSelector(
    (state) => state.note,
  );
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [alsoDeleteNotes, setAlsoDeleteNotes] = useState(false);
  const [checkNotebookName, setCheckNotebookName] = useState('');
  const [notebookNameError, setNotebookNameError] = useState(false);
  const [anName, setANName] = useState('');
  const [autoNoteExists, setAutoNoteExists] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    setNotebookNameError(
      checkNotebookName && checkNotebookName != notebookName ? true : false,
    );
  }, [checkNotebookName, notebookName]);

  useEffect(() => {
    autoNotes?.map((autoNote) => {
      if (autoNote.autoNoteNotebookID === notebook_id) {
        setAutoNoteExists(true);
        setANName(autoNote.autoNoteName);
      }
      setANName('');
      setAutoNoteExists(false);
    });
  }, [autoNotes, notebook_id]);

  async function handleDelete(e) {
    e.preventDefault();
    try {
      setLoading(true);
      let filteredNotes,
        filteredNotebooks = [];
      if (alsoDeleteNotes) {
        filteredNotes = notes?.filter(
          (note) => note.notebook_ref_id !== notebook_id,
        );
      }
      Object.keys(notebooks).forEach((notebookID) => {
        if (notebookID != notebook_id) {
          filteredNotebooks.push(notebooks[notebookID]);
        }
      });
      await axios.put(
        `${process.env.API}/api/data/update`,
        { notes: filteredNotes, notebooks: filteredNotebooks },
        {
          headers: {
            notesDocID: user?.userData?.notesDocID,
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
        color: user?.userData?.theme,
      });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  }

  const resetForm = () => {
    setCheckNotebookName('');
    setAlsoDeleteNotes(false);
  };

  if (!mount) return null;

  return (
    <Dialog
      open={open && !isDropDownMenuOpen}
      onOpenChange={(open) => {
        setOpen(open);
        setTimeout(() => {
          if (!open) {
            document.body.style.pointerEvents = '';
          }
        }, 100);
      }}
    >
      <DialogContent
        onInteractOutside={resetForm}
        onPointerDownOutside={resetForm}
        onEscapeKeyDown={resetForm}
        onCloseAutoFocus={resetForm}
        className={fontClassifier(user?.userData?.font)}
      >
        <DialogHeader>
          <DialogTitle>
            {autoNoteExists ? "Can't delete notebook" : 'Delete Notebook'}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        {autoNoteExists ? (
          <section>
            <p>
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
            </p>
            <DialogFooter>
              <DialogClose
                className={cn(buttonVariants({ variant: 'secondary' }))}
                onClick={() => {
                  setOpen(false);
                  setCheckNotebookName('');
                }}
              >
                Close
              </DialogClose>
              <Link href={`${process.env.API}/dashboard/auto-note`}>
                <Button>Go to autonote</Button>
              </Link>
            </DialogFooter>
          </section>
        ) : (
          <form onSubmit={(e) => handleDelete(e)}>
            <div className="pb-2">
              <Label htmlFor="notebookName">Enter Notebook Name</Label>
              <Input
                id="notebookName"
                value={checkNotebookName}
                onChange={(e) => setCheckNotebookName(e.target.value)}
                required
              />
              <Label className="text-red-600">
                {notebookNameError && "Notebook doesn't exists"}
              </Label>
            </div>
            <div className="flex items-center text-center my-2">
              <Checkbox
                checked={alsoDeleteNotes}
                onCheckedChange={setAlsoDeleteNotes}
                id="alsoDeleteNotes"
              />
              <Label className="pl-1 text-md" htmlFor="alsoDeleteNotes">
                Also delete notes inside this notebook.
              </Label>
            </div>
            <DialogFooter>
              <DialogClose
                className={cn(buttonVariants({ variant: 'secondary' }))}
                onClick={() => {
                  setOpen(false);
                  setCheckNotebookName('');
                  setAlsoDeleteNotes(false);
                }}
              >
                Cancel
              </DialogClose>
              <Button
                variant="destructive"
                type="submit"
                className={cn(!isDesktop && 'my-2', 'font-semibold')}
                disabled={
                  notebookNameError || loading || checkNotebookName.trim() == ''
                }
              >
                <ButtonLoader loading={loading} label="Delete Notebook" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
