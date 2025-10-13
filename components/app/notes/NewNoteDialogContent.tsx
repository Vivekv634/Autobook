"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createNote } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { v4 } from "uuid";
import ButtonLoader from "../ButtonLoader";
import { useRouter } from "next/navigation";
import { Block } from "@/text-editor/types/type";
import { nanoid } from "@reduxjs/toolkit";
import { ID_LENGTH } from "@/text-editor/types/type";

interface NewNoteDialogProps {
  loading: boolean;
  setLoadingAction: (loading: boolean) => void;
  setDialogOpenAction: (value: boolean) => void;
}

export default function NewNoteDialog({
  loading,
  setLoadingAction,
  setDialogOpenAction: setNoteDialogOpenAction,
}: NewNoteDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { uid } = useSelector((state: RootState) => state.user);
  const [name, setNameAction] = useState<string>("");
  const router = useRouter();

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoadingAction(true);
      toast.info("Creating new note...");
      const noteBody: Block = {
        id: nanoid(ID_LENGTH),
        content: "",
        meta: {},
        type: "paragraph",
      };
      const note: NoteType = {
        auth_id: uid,
        title: name,
        body: JSON.stringify(noteBody),
        created_at: Date.now(),
        updated_at: Date.now(),
        note_id: v4(),
      };
      const dispatchResponse = await dispatch(createNote({ note, uid }));
      if (dispatchResponse.meta.requestStatus === "fulfilled") {
        router.push(
          `/dashboard/${(dispatchResponse.payload as NoteType).note_id}`
        );
        toast.success("New Note created!");
      } else toast.error("Something went wrong. Try again!");
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoadingAction(false);
      setNoteDialogOpenAction(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Note title</DialogTitle>
        <DialogDescription>Enter the name of the note</DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => handleSubmitForm(e)}>
        <Input
          value={name}
          onChange={(e) => setNameAction(e.target.value)}
          placeholder="Note title"
          className="mb-5"
          required
        />
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            close
          </DialogClose>
          <ButtonLoader
            loadingLabel={"Creating..."}
            type="submit"
            label="Create Note"
            disabled={loading}
            loading={loading}
          />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
