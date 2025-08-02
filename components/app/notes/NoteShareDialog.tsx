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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { shareNote, ShareNoteProps } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ButtonLoader from "../ButtonLoader";

interface Props {
  note: NoteType;
  openShareDialog: string | null;
  setOpenShareDialogAction(value: string | null): void;
}

export default function NoteShareDialog({
  note,
  openShareDialog,
  setOpenShareDialogAction,
}: Props) {
  const [linkgenerated, setLinkGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { sharedNotes } = useSelector((state: RootState) => state.notes);
  const { uid } = useSelector((state: RootState) => state.user);
  const [day, setDay] = useState("1");

  useEffect(() => {
    if (sharedNotes) {
      sharedNotes.forEach(({ sharedNote, URL }) => {
        if (sharedNote.note_id === note.note_id) {
          setLinkGenerated(URL);
          return;
        }
      });
    }
  }, [note.note_id, sharedNotes]);

  async function generateLink() {
    try {
      setLoading(true);
      toast.info("Generating link...");
      const dispatchResponse = await dispatch(shareNote({ note, day, uid }));

      if (dispatchResponse.meta.requestStatus == "fulfilled") {
        setLinkGenerated((dispatchResponse.payload as ShareNoteProps).URL);
      } else {
        console.error(dispatchResponse.payload);
        toast.error(dispatchResponse.payload as string);
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  }

  function buttonClickHandler() {
    if (linkgenerated) {
      navigator.clipboard.writeText(linkgenerated);
      toast.success("Link copied to clipboard!");
    } else generateLink();
  }

  return (
    <Dialog
      open={openShareDialog === note.note_id}
      onOpenChange={(open) => {
        if (!open) setOpenShareDialogAction(null);
      }}
    >
      <DialogContent key={note.note_id}>
        <DialogHeader>
          <DialogTitle>Share note</DialogTitle>
          <DialogDescription>
            Manage your all shared notes from{" "}
            <Link href={"/settings"} className="underline">
              settings
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <section
          className={cn("flex gap-2 items-center", linkgenerated && "hidden")}
        >
          <span>Share note for</span>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(7).keys()].map((i: number) => {
                return (
                  <SelectItem value={`${i + 1}`} key={i}>
                    {i + 1}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span>day(s)</span>
        </section>

        <Input
          value={linkgenerated}
          readOnly
          className={cn(!linkgenerated && "hidden")}
        />

        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            cancel
          </DialogClose>
          <ButtonLoader
            className="font-semibold cursor-pointer"
            onClick={buttonClickHandler}
            disabled={loading}
            loading={loading}
            label={linkgenerated ? "Copy Link" : "Generate Link"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
