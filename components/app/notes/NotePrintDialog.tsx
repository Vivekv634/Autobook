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
import { NoteType } from "@/types/Note.type";
import ButtonLoader from "../ButtonLoader";

interface Props {
  note: NoteType;
  openPrintDialog: string | null;
  setOpenPrintDialogAction(value: string | null): void;
}

export default function NotePrintDialog({
  openPrintDialog,
  setOpenPrintDialogAction,
  note,
}: Props) {
  return (
    <Dialog
      open={openPrintDialog === note.note_id}
      onOpenChange={(open) => {
        if (!open) setOpenPrintDialogAction(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Note</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            cancel
          </DialogClose>
          <ButtonLoader
            type="submit"
            className="font-semibold"
            loading={false}
            disabled={false}
            label="Print"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
