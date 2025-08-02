import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NoteType } from "@/types/Note.type";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pen, Printer, Share, Trash2 } from "lucide-react";
import Link from "next/link";
import NoteDeleteDialog from "./NoteDeleteDialog";
import NotePrintDialog from "./NotePrintDialog";
import NoteRenameDialog from "./NoteRenameDialog";
import NoteShareDialog from "./NoteShareDialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export default function SidebarNotesRenderComponent({
  notes,
}: {
  notes: NoteType[];
}) {
  const isMobile = useIsMobile();
  const pathName = usePathname();
  const [openRenameDialog, setOpenRenameDialog] = useState<string | null>(null);
  const [openPrintDialog, setOpenPrintDialog] = useState<string | null>(null);
  const [openShareDialog, setOpenShareDialog] = useState<string | null>(null);
  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState<
    string | null
  >(null);

  return (
    notes.length != 0 &&
    notes.map((subItem: NoteType, index) => {
      return (
        <DropdownMenu key={index} modal={true}>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              asChild
              className={cn(
                "cursor-pointer",
                pathName.includes(subItem.note_id) && "bg-muted"
              )}
            >
              <div className="flex justify-between h-10 w-full">
                <Link
                  href={`/dashboard/${subItem.note_id}`}
                  className="min-w-8/10 w-full h-full"
                >
                  <span className="block truncate w-[140px] text-left h-full py-[10px]">
                    {subItem.title}
                  </span>
                </Link>
                <DropdownMenuTrigger asChild>
                  <div className="h-full grid place-items-center min-w-2/10 w-full">
                    <Ellipsis className="p-1" />
                  </div>
                </DropdownMenuTrigger>

                <NoteRenameDialog
                  note={subItem}
                  openRenameDialog={openRenameDialog}
                  setOpenRenameDialogAction={setOpenRenameDialog}
                  onClose={() => setOpenRenameDialog(null)}
                />

                <NotePrintDialog
                  note={subItem}
                  openPrintDialog={openPrintDialog}
                  setOpenPrintDialogAction={setOpenPrintDialog}
                />

                <NoteShareDialog
                  note={subItem}
                  openShareDialog={openShareDialog}
                  setOpenShareDialogAction={setOpenShareDialog}
                />

                <NoteDeleteDialog
                  openDeleteDialog={openDeleteNoteDialog}
                  setOpenDeleteDialogAction={setOpenDeleteNoteDialog}
                  note={subItem}
                  onClose={() => setOpenDeleteNoteDialog(null)}
                />
              </div>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          <DropdownMenuContent
            align={isMobile ? "end" : "start"}
            side={isMobile ? "bottom" : "right"}
          >
            <DropdownMenuItem
              onClick={() => setOpenRenameDialog(subItem.note_id)}
              className="flex gap-2"
            >
              <Pen /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenPrintDialog(subItem.note_id)}
              className="flex gap-2"
            >
              <Printer /> Print
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenShareDialog(subItem.note_id)}
              className="flex gap-2"
            >
              <Share /> Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenDeleteNoteDialog(subItem.note_id)}
              className="flex gap-2"
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    })
  );
}
