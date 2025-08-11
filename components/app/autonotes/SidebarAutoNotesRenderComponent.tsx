import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AutoNoteType } from "@/types/AutoNote.types";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SidebarNotesRenderComponent({
  autonotes,
}: {
  autonotes: AutoNoteType[];
}) {
  const pathName = usePathname();
  return (
    autonotes.length > 0 &&
    "autonote_id" in autonotes[0] &&
    autonotes.map((subItem: AutoNoteType, index) => {
      return (
        <SidebarMenuSubItem key={index}>
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
            </div>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    })
  );
}
