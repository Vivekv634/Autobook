/* eslint-disable @typescript-eslint/no-unused-vars */
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
import ButtonLoader from "../ButtonLoader";
import { AutoNoteType } from "@/types/AutoNote.types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
  autonote: AutoNoteType;
  openAutonoteEditDialog: string | null;
  setOpenAutonoteEditDialogAction(value: string | null): void;
}

export default function AutonoteEditDialog({
  openAutonoteEditDialog,
  setOpenAutonoteEditDialogAction,
  autonote,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={openAutonoteEditDialog === autonote.autonote_id}
      onOpenChange={(open) => {
        if (!open) setOpenAutonoteEditDialogAction(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit autonote</DialogTitle>
          <DialogDescription>
            Edit your autonote configuration here.
          </DialogDescription>
        </DialogHeader>
        <form>
          <DialogFooter>
            <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
              cancel
            </DialogClose>
            <ButtonLoader
              type="submit"
              className="font-semibold"
              loading={loading}
              disabled={loading}
              label="Save changes"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
