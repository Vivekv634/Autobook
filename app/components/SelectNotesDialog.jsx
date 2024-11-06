import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonLoader from './ButtonLoader';
import { useCustomToast } from './SendToast';
import axios from 'axios';
import { themeColors } from '../utils/pageData';

export default function SelectNotesDialog({ isDropdownOpen, open, setOpen }) {
  const { notes, user } = useSelector((state) => state.note);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();

  const handleCheckClick = (selectedNote) => {
    if (selectedNotes.includes(selectedNote)) {
      setSelectedNotes(
        selectedNotes.filter((note) => note.noteID !== selectedNote.noteID),
      );
    } else {
      setSelectedNotes([...selectedNotes, selectedNote]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedNotes = selectedNotes.map((note) => {
        return { ...note, isTrash: true };
      });
      await axios.put(
        `${process.env.API}/api/data/update`,
        { notes: updatedNotes },
        { headers: { notesDocID: user?.userData?.notesDocID } },
      );
      setLoading(false);
      setOpen(false);
      toast({
        description: `${selectedNotes.length} note(s) deleted!`,
        color: themeColors[user?.userData?.theme],
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        description: 'Oops! something went wrong! Try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog
      open={open && !isDropdownOpen}
      onOpenChange={(open) => {
        setOpen(open);
        setTimeout(() => {
          if (!open) {
            setSelectedNotes([]);
            document.body.style.pointerEvents = '';
          }
        }, 100);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Notes</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <form className="overflow-hidden" onSubmit={handleFormSubmit}>
          <ScrollArea className="w-full border p-2 rounded-md h-72">
            {notes?.map((note, index) => {
              return (
                <div
                  key={index}
                  className="flex bg-muted rounded-md mb-2 p-2 border gap-2 items-start"
                >
                  <Checkbox
                    id={note.noteID}
                    className="my-1"
                    onCheckedChange={() => handleCheckClick(note)}
                  />
                  <Label
                    className="text-wrap text-md w-full"
                    htmlFor={note.noteID}
                  >
                    {note.title}
                  </Label>
                </div>
              );
            })}
          </ScrollArea>
          <DialogFooter className="mt-2">
            <DialogClose
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Close
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!selectedNotes.length}
              type="submit"
            >
              <ButtonLoader loading={loading} label="Move to Trash" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
