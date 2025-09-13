import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateNote } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ButtonLoader from "../ButtonLoader";

interface Props {
  onClose: () => void;
  note: NoteType;
  openRenameDialog: string | null;
  setOpenRenameDialogAction(value: string | null): void;
}

export default function NoteRenameDialog({
  openRenameDialog,
  setOpenRenameDialogAction,
  note,
  onClose,
}: Props) {
  const [noteTitle, setNoteTitle] = useState(note.title);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { uid } = useSelector((state: RootState) => state.user);

  async function handleRenameNoteTitle(e: FormEvent<HTMLFormElement>) {
    try {
      setLoading(true);
      e.preventDefault();
      toast.info("Renaming note title...");
      const updatedNote: NoteType = {
        ...note,
        title: noteTitle,
        updated_at: Date.now(),
      };

      const dispatchResponse = await dispatch(
        updateNote({ note: updatedNote, uid })
      );

      if (dispatchResponse.meta.requestStatus == "fulfilled") {
        toast.success("Note title updated!");
      } else {
        toast.error(dispatchResponse.payload as string);
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <Dialog
      open={openRenameDialog === note.note_id}
      onOpenChange={(open) => {
        if (!open) setOpenRenameDialogAction(null);
      }}
      modal={false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit note title</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRenameNoteTitle}>
          <Input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
            className="mb-5"
          />
          <DialogFooter>
            <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
              cancel
            </DialogClose>
            <ButtonLoader
              loadingLabel={"Renaming..."}
              type="submit"
              className="font-semibold"
              loading={loading}
              disabled={loading}
              label="Rename"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
