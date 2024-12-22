import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { setNotesView } from "../redux/slices/noteSlice";
import { Columns2, Rows2, SquareDashedMousePointer } from "lucide-react";
import { useMediaHook } from "@/app/utils/mediaHook";
import SelectNotesDialog from "./SelectNotesDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import fontClassifier from "../utils/font-classifier";

export default function NotesMoreToolsDropDownMenu({ children }) {
  const { notesView, notes } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const isDesktop = useMediaHook({ screenWidth: 1024 });
  const [selectNotes, setSelectNotes] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.note);

  const handleNotesView = (e) => {
    dispatch(setNotesView(e));
  };
  return (
    <>
      <DropdownMenu modal={true} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(fontClassifier(user?.userData?.font), "w-52")}
        >
          <DropdownMenuRadioGroup
            value={notesView}
            onValueChange={(e) => handleNotesView(e)}
          >
            <DropdownMenuLabel>Notes view</DropdownMenuLabel>
            <DropdownMenuRadioItem
              disabled={!isDesktop || notes?.length == 0}
              className="flex justify-between"
              value="rows"
            >
              Rows view <Rows2 />
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              disabled={!isDesktop || notes?.length == 0}
              className="flex justify-between"
              value="columns"
            >
              Columns view <Columns2 />
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={notes?.length == 0}
            onClick={() => {
              setSelectNotes(true);
            }}
            className="flex justify-between"
          >
            Select notes <SquareDashedMousePointer />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SelectNotesDialog
        isDropdownOpen={dropdownOpen}
        open={selectNotes}
        setOpen={setSelectNotes}
      />
    </>
  );
}
