import React, { useEffect, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import { Checkbox } from '@/components/ui/checkbox';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useCustomToast } from './SendToast';

const DeleteAutoNoteDialog = ({ AutoNote, open, setOpen }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [autoNoteName, setAutoNoteName] = useState('');
  const [alsoDeleteNotes, setAlsoDeleteNotes] = useState(false);
  const [alsoDeleteNotebook, setAlsoDeleteNotebook] = useState(false);
  const [autoNoteNameError, setAutoNoteNameError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { autoNotes, notebooks, notes, user } = useSelector(
    (state) => state.note,
  );
  const toast = useCustomToast();

  useEffect(() => {
    setAutoNoteNameError(
      autoNoteName && autoNoteName !== AutoNote.autoNoteName ? true : null,
    );
  }, [AutoNote.autoNoteName, autoNoteName]);

  const handleAutoNoteDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let body = {
        autoNotes: autoNotes.filter(
          (autoNote) => autoNote.autoNoteID !== AutoNote.autoNoteID,
        ),
      };
      if (alsoDeleteNotebook) {
        let Notebooks = [];
        Object.keys(notebooks).forEach((notebook_id) => {
          if (notebook_id !== AutoNote.autoNoteNotebookID) {
            Notebooks.push({
              notebookID: notebook_id,
              ...notebooks[notebook_id],
            });
          }
        });
        body['notebooks'] = Notebooks;
      }
      if (alsoDeleteNotes) {
        body['notes'] = notes.filter(
          (note) => note.notebook_ref_id !== AutoNote.autoNoteNotebookID,
        );
      }
      await axios.delete(`${process.env.API}/api/data/delete`, {
        data: body,
        headers: { notesDocID: user?.userData?.notesDocID },
      });
      setLoading(false);
      setOpen(false);
      toast({
        description: (
          <span>
            <span className="font-bold">{autoNoteName}</span> AutoNote deleted!
          </span>
        ),
        color: user?.userData?.theme,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete AutoNote</DialogTitle>
          <DialogDescription>
            This operation can&apos;t be reverse. Delete the AutoNote by writing
            the AutoNote name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleAutoNoteDelete(e)}>
          <div>
            <Label id="autoNoteName">AutoNote Name</Label>
            <Input
              value={autoNoteName}
              onChange={(e) => setAutoNoteName(e.target.value)}
              id="autoNoteName"
              required
              className="my-1"
            />
            <Label className="my-1 text-red-500">
              {autoNoteNameError && "AutoNote name does'nt match"}
            </Label>
          </div>
          <div className="flex items-center my-2">
            <Checkbox
              checked={alsoDeleteNotebook}
              onCheckedChange={setAlsoDeleteNotebook}
              id="alsoDeleteNotebook"
              disabled={
                loading || autoNoteName.trim() === '' || autoNoteNameError
              }
            />
            <Label className="pl-2" htmlFor="alsoDeleteNotebook">
              Also Delete the notebook of AutoNote.
            </Label>
          </div>
          <div className="flex items-center my-2">
            <Checkbox
              checked={alsoDeleteNotes}
              onCheckedChange={setAlsoDeleteNotes}
              id="alsoDeleteNotes"
              disabled={
                loading || autoNoteName.trim() === '' || autoNoteNameError
              }
            />
            <Label className="pl-2" htmlFor="alsoDeleteNotes">
              Also Delete all the notes created by this AutoNote forever.
            </Label>
          </div>
          <DialogFooter>
            <DialogClose
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </DialogClose>
            <Button
              className={cn(!isDesktop && 'my-2', 'font-semibold')}
              variant="destructive"
              type="submit"
              disabled={
                loading || autoNoteNameError || autoNoteName.trim() === ''
              }
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-[18px] mr-1 my-auto animate-spin" />{' '}
                  Loading...
                </div>
              ) : (
                'Delete AutoNote'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAutoNoteDialog;
