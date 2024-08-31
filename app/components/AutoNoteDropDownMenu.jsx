'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenLine, Trash2 } from 'lucide-react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import { useState } from 'react';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';

const AutoNoteDropDownMenu = ({ autoNote, children }) => {
  const [deleteDialogOpen, setDeteleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 mr-2">
          <DropdownMenuItem
            onClick={() => setEditDialogOpen(true)}
            className="flex justify-between items-center"
          >
            Edit <PenLine className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeteleDialogOpen(true)}
            className="flex justify-between items-center text-red-400"
          >
            Delete <Trash2 className="h-4 w-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAutoNoteDialog
        autoNote={autoNote}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
      <DeleteAutoNoteDialog
        autoNote={autoNote}
        open={deleteDialogOpen}
        setOpen={setDeteleDialogOpen}
      />
    </>
  );
};

export default AutoNoteDropDownMenu;
