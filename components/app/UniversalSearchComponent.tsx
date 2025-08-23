import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { Command, Home, Settings, Verified } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const generalShortcuts = [
  { icon: <Home />, label: "Dashboard", href: "/dashboard" },
  { icon: <Verified />, label: "Account", href: "/account" },
  { icon: <Settings />, label: "Settings", href: "/settings" },
  { icon: <Command />, label: "Shortcuts", href: "/shortcuts" },
];

interface UniversalSearchComponentProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function UniversalSearchComponent({
  open,
  setOpen,
}: UniversalSearchComponentProps) {
  const { notes } = useSelector((state: RootState) => state.notes);
  const { autonotes } = useSelector((state: RootState) => state.autonote);
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          {generalShortcuts.map((s, i) => {
            return (
              <CommandItem
                key={i}
                onSelect={() => {
                  setOpen(false);
                  router.push(s.href);
                }}
                className="font-semibold ml-3 cursor-pointer"
              >
                {s.icon} {s.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          heading="Notes"
          className={cn(notes.length == 0 && "hidden")}
        >
          {notes?.map((n, i) => {
            return (
              <CommandItem
                key={i}
                className="ml-3 font-semibold cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  router.push(`/dashboard/${n.note_id}`);
                }}
              >
                {n.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup
          heading="Autonotes"
          className={cn(autonotes.length == 0 && "hidden")}
        >
          {autonotes?.map((an, i) => {
            return (
              <CommandItem
                key={i}
                className="ml-3 font-semibold cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  router.push(`/dashboard/autonotes/${an.autonote_id}`);
                }}
              >
                {an.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
