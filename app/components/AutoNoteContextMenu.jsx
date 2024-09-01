import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog } from '@/components/ui/dialog';
import { PenLine, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';
import { state } from '../utils/schema';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAutoNotes } from '../redux/slices/noteSlice';
import { useToast } from '@/components/ui/use-toast';

const AutoNoteContextMenu = ({ autoNote, children }) => {
  const [deleteDialogOpen, setDeteleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAutoNoteStateChange = async (newState) => {
    try {
      if (newState == autoNote.state) return;
      let updatedAutoNoteBody = {
        state: newState,
      };
      if (newState == 'running') {
        const currentTime = new Date().getTime();
        updatedAutoNoteBody['lastNoteGenerationTime'] = currentTime;
      }
      const autoNoteResponse = await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        updatedAutoNoteBody,
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      dispatch(setAutoNotes(autoNoteResponse.data.result));
      toast({
        description: 'Auto Note updated successfully',
        className: 'bg-green-400',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Please try again later.',
        className: 'bg-red-400',
      });
    }
  };

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
          <ContextMenuRadioGroup value={autoNote.state}>
            {state.map((State, index) => {
              return (
                <ContextMenuRadioItem
                  key={index}
                  value={State.value}
                  onClick={() => {
                    handleAutoNoteStateChange(State.value);
                  }}
                >
                  {State.label}
                </ContextMenuRadioItem>
              );
            })}
          </ContextMenuRadioGroup>
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
