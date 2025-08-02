import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AutoNoteType } from "@/types/AutoNote.types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SidebarNotesRenderComponent({
  autonotes,
}: {
  autonotes: AutoNoteType[];
}) {
  const isMobile = useIsMobile();
  const pathName = usePathname();

  return (
    autonotes.length > 0 &&
    "autonote_id" in autonotes[0] &&
    autonotes.map((subItem: AutoNoteType, index) => {
      return (
        <DropdownMenu key={index} modal={true}>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              asChild
              className={cn(
                "cursor-pointer",
                pathName.includes(subItem.autonote_id) && "bg-muted"
              )}
            >
              <div className="flex justify-between h-10 w-full">
                <Link
                  href={`/dashboard/autonotes/${subItem.autonote_id}`}
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

                {/* Add dialogs for AutoNotes if needed */}
              </div>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          <DropdownMenuContent
            align={isMobile ? "end" : "start"}
            side={isMobile ? "bottom" : "right"}
          >
            {/* Add actions for AutoNotes if needed */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    })
  );
}
