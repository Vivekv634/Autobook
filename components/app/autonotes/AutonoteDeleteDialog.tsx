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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAutonote } from "@/redux/features/autonote.features";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
  autonote: AutoNoteType;
  openAutonoteDeleteDialog: string | null;
  setOpenAutonoteDeleteDialogAction(value: string | null): void;
}

export default function AutonoteDeleteDialog({
  openAutonoteDeleteDialog,
  setOpenAutonoteDeleteDialogAction,
  autonote,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const { uid } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  async function handleForm() {
    try {
      setLoading(true);
      const dispatchResponse = await dispatch(
        deleteAutonote({ user_id: uid, autonote_id: autonote.autonote_id })
      );

      if (dispatchResponse.meta.requestStatus == "fulfilled") {
        toast.success("Autonote deleted successfully!");
        onClose();
        router.push("/dashboard");
      } else toast.error(dispatchResponse.payload as string);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    }
  }
  return (
    <Dialog
      open={openAutonoteDeleteDialog === autonote.autonote_id}
      onOpenChange={(open) => {
        if (!open) setOpenAutonoteDeleteDialogAction(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete autonote</DialogTitle>
          <DialogDescription>
            This operation can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForm();
          }}
        >
          <Label htmlFor="confirmTitle">
            To confirm autonote deletion, type
            <strong>Delete {autonote.title}</strong> below.
          </Label>
          <Input
            value={confirmTitle}
            onChange={(e) => setConfirmTitle(e.target.value)}
            required
            className="my-2"
            id="confirmTitle"
            autoComplete="off"
          />
          <DialogFooter>
            <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
              cancel
            </DialogClose>
            <ButtonLoader
              type="submit"
              className="font-semibold"
              loading={loading}
              disabled={confirmTitle != `Delete ${autonote.title}` || loading}
              label="Delete Autonote"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
