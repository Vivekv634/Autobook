import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pages } from "../utils/pageData";
import { Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import fontClassifier from "../utils/font-classifier";

export default function GlobalSearchDialog() {
  const { notes, notebooks, tagsData, autoNotes, user } = useSelector(
    (state) => state.note,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNoteOnClick = (noteData) => {
    router.push(`/dashboard/${user?.userData?.notesDocID}/${noteData.noteID}`);
    setOpen((open) => !open);
  };

  const handleNotebookOnClick = (notebook_id) => {
    router.push(`/dashboard/notebooks#${notebook_id}`);
    setOpen((open) => !open);
  };

  const handleTagsOnClick = (tag) => {
    router.push(`/dashboard/tags#${tag}`);
    setOpen((open) => !open);
  };

  const handleAutoNoteOnClick = (autoNote) => {
    router.push(`/dashboard/auto-note#${autoNote.autoNoteID}`);
    setOpen((open) => !open);
  };

  const handlePageRedirect = (page) => {
    router.push(page.address);
    setOpen((open) => !open);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        className={fontClassifier(user?.userData?.font)}
        placeholder="search..."
      />
      <CommandList className={fontClassifier(user?.userData?.font)}>
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {pages.map((page, index) => {
            return (
              <CommandItem
                onSelect={() => handlePageRedirect(page)}
                key={index}
              >
                <div className="flex w-full h-full">
                  {page.icon}
                  <span className="ml-1">{page.label}</span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(!notes?.length && "hidden")}
          heading="Notes"
        >
          {notes?.map((note, index) => {
            return (
              <CommandItem
                onSelect={() => handleNoteOnClick(note)}
                key={index}
                asChild
              >
                <div className="flex w-full h-full">
                  {pages[0].icon}
                  <span className="ml-1">{note?.title}</span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(!Object.keys(notebooks).length && "hidden")}
          heading="Notebooks"
        >
          {Object.keys(notebooks).length &&
            Object.keys(notebooks).map((notebook_id, index) => {
              return (
                <CommandItem
                  onSelect={() => handleNotebookOnClick(notebook_id)}
                  key={index}
                  asChild
                >
                  <div className="flex w-full h-full">
                    {pages[1].icon}
                    <span className="ml-1">
                      {notebooks[notebook_id].notebookName}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(!Object.keys(tagsData).length && "hidden")}
          heading="Tags"
        >
          {Object.keys(tagsData).length &&
            Object.keys(tagsData).map((tag, index) => {
              return (
                <CommandItem
                  onSelect={() => handleTagsOnClick(tag)}
                  key={index}
                  asChild
                >
                  <div className="flex w-full h-full">
                    {pages[3].icon}
                    <span className="ml-1">{tag}</span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(!autoNotes?.length && "hidden")}
          heading="Auto Notes"
        >
          {autoNotes?.map((autoNote, index) => {
            return (
              <CommandItem
                onSelect={() => handleAutoNoteOnClick(autoNote)}
                key={index}
                asChild
              >
                <div>
                  {pages[4].icon}
                  <span className="ml-1">{autoNote.autoNoteName}</span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => {
              router.push("/account/profile");
              setOpen((open) => !open);
            }}
            asChild
          >
            <div>
              <UserRound />
              <span className="ml-1">Profile</span>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/account/settings");
              setOpen((open) => !open);
            }}
            asChild
          >
            <div>
              <Settings />
              <span className="ml-1">Settings</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
