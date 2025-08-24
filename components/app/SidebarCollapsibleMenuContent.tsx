"use client";

import { Home, NotebookText, Plus, Search } from "lucide-react";

import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { fetchNotes, fetchSharedNotes } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import CollapsibleMenuContent from "./CollapsibleMenuContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { fetchAutoNotes } from "@/redux/features/autonote.features";
import { AutoNoteType } from "@/types/AutoNote.types";
import UniversalSearchComponent from "./UniversalSearchComponent";

export function SidebarCollapsibleMenuContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { uid } = useSelector((state: RootState) => state.user);
  const { notes } = useSelector((state: RootState) => state.notes);
  const { autonotes } = useSelector((state: RootState) => state.autonote);
  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [createAutoNoteLoading, setCreateAutoNoteLoading] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [autoNoteDialogOpen, setAutoNoteDialogOpen] = useState(false);
  const [sortedNotes, setSortedNotes] = useState<NoteType[]>([]);
  const [sortedAutoNotes, setSortedAutoNotes] = useState<AutoNoteType[]>([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!uid) return;
    dispatch(fetchNotes(uid));
    dispatch(fetchAutoNotes(uid));
    dispatch(fetchSharedNotes(uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    if (notes) {
      const tempNotes = [...notes].sort(
        (note1: NoteType, note2: NoteType) =>
          note2.updated_at - note1.updated_at
      );
      setSortedNotes(tempNotes);
    }
  }, [notes]);

  useEffect(() => {
    if (autonotes) {
      const tempAutoNotes = [...autonotes].sort(
        (autoNote1: AutoNoteType, autoNote2: AutoNoteType) =>
          autoNote2.updated_at - autoNote1.updated_at
      );
      setSortedAutoNotes(tempAutoNotes);
    }
  }, [autonotes]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="cursor-pointer">
            <Button size="icon" variant={"ghost"} className="cursor-pointer">
              <Home className="h-5 w-5 " />
            </Button>
          </Link>
          <div className="flex">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer"
              onClick={() => setSearchDialogOpen(!searchDialogOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="bg-muted" />
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "cursor-pointer"
                )}
              >
                <Plus className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setNoteDialogOpen(true)}>
                    add note
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAutoNoteDialogOpen(true)}>
                    add autonote
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
        <CollapsibleMenuContent
          title="Note title"
          description="Enter the name of the note"
          item={{ title: "Notes", icon: NotebookText, items: sortedNotes }}
          loading={createNoteLoading}
          dialogOpen={noteDialogOpen}
          setLoadingAction={setCreateNoteLoading}
          setDialogOpen={setNoteDialogOpen}
        />
        <CollapsibleMenuContent
          title="AutoNote title"
          description="Enter the name of the autonote"
          item={{
            title: "AutoNotes",
            icon: NotebookText,
            items: sortedAutoNotes,
          }}
          loading={createAutoNoteLoading}
          setLoadingAction={setCreateAutoNoteLoading}
          dialogOpen={autoNoteDialogOpen}
          setDialogOpen={setAutoNoteDialogOpen}
        />
      </SidebarMenu>
      <UniversalSearchComponent
        open={searchDialogOpen}
        setOpen={setSearchDialogOpen}
      />
    </SidebarGroup>
  );
}
