import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog } from '@/components/ui/dialog';
import { PenLine, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';

const AutoNoteContextMenu = ({ autoNote, children }) => {
  const [deleteDialogOpen, setDeteleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setEditDialogOpen(true)}
            className="flex justify-between items-center"
          >
            Edit
            <PenLine className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setDeteleDialogOpen(true)}
            className="flex justify-between items-center text-red-400"
          >
            Delete <Trash2 className="h-4 w-5" />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
    </Dialog>
  );
};

export default AutoNoteContextMenu;
