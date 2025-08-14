import { ChevronRight, LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NoteType } from "@/types/Note.type";
import { Dialog, DialogPortal } from "../ui/dialog";
import NewAutoNoteDialog from "./autonotes/NewAutoNoteDialog";
import NewNoteDialog from "./notes/NewNoteDialogContent";
import { AutoNoteType } from "@/types/AutoNote.types";
import SidebarNotesRenderComponent from "./notes/SidebarNotesRenderComponent";
import SidebarAutoNotesRenderComponent from "./autonotes/SidebarAutoNotesRenderComponent";

interface props {
  item: {
    title: string;
    icon: LucideIcon;
    items: NoteType[] | AutoNoteType[];
  };
  title: string;
  description: string;
  loading: boolean;
  setLoadingAction: (loading: boolean) => void;
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
}

export default function CollapsibleMenuContent({
  item,
  title,
  loading,
  setLoadingAction,
  dialogOpen,
  setDialogOpen,
}: props) {
  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={true}
      className="group/collapsible"
    >
      <SidebarMenuItem className="pt-1">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="h-10 cursor-pointer"
          >
            <item.icon />
            <span className="font-bold">
              {item.title}{" "}
              <span
                className={cn(
                  "text-muted-foreground/80",
                  item.items.length == 0 ? "hidden" : ""
                )}
              >
                {item.items.length}
              </span>
            </span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="w-11/12">
            <Dialog
              modal={true}
              open={dialogOpen}
              onOpenChange={(e) => setDialogOpen(e)}
            >
              <DialogPortal>
                {title.includes("AutoNote") ? (
                  <NewAutoNoteDialog
                    loading={loading}
                    setDialogOpenAction={setDialogOpen}
                  />
                ) : (
                  <NewNoteDialog
                    loading={loading}
                    setLoadingAction={setLoadingAction}
                    setDialogOpenAction={setDialogOpen}
                  />
                )}
              </DialogPortal>
            </Dialog>
            {item.items.length > 0 &&
              ("autonote_id" in item.items[0] ? (
                <SidebarAutoNotesRenderComponent
                  autonotes={item.items as AutoNoteType[]}
                />
              ) : (
                <SidebarNotesRenderComponent notes={item.items as NoteType[]} />
              ))}
            {item.items.length == 0 && (
              <p className="text-muted-foreground italic text-center">
                No items here.
              </p>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
