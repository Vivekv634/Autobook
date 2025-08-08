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
import { cn } from "@/lib/utils";
import { deleteNote } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ButtonLoader from "../ButtonLoader";
import { useRouter } from "next/navigation";

interface Props {
  openDeleteDialog: string | null;
  setOpenDeleteDialogAction(value: string | null): void;
  onClose: () => void;
  note: NoteType;
}

export default function NoteDeleteDialog({
  note,
  onClose,
  openDeleteDialog,
  setOpenDeleteDialogAction,
}: Props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { uid } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  async function handleNoteDelete() {
    try {
      setLoading(true);
      toast.info("Deleting note...");

      const dispatchResponse = await dispatch(
        deleteNote({ note_id: note.note_id, auth_id: uid })
      );

      if (dispatchResponse.meta.requestStatus == "fulfilled") {
        router.push("/dashboard");
        toast.success("Note deleted successfully!");
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
      open={openDeleteDialog === note.note_id}
      onOpenChange={(open) => {
        if (!open) setOpenDeleteDialogAction(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>
            This operation can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            cancel
          </DialogClose>
          <ButtonLoader
            className="font-semibold cursor-pointer"
            onClick={handleNoteDelete}
            disabled={loading}
            loading={loading}
            label="Delete Note"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
