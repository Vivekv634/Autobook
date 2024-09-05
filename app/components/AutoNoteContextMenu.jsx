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
import { PenLine, SquarePlus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';
import { notes, state } from '../utils/schema';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAutoNotes, setNotes } from '../redux/slices/noteSlice';
import { useToast } from '@/components/ui/use-toast';
import { titleFormatter } from '../utils/titleFormatter';

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
        className: 'bg-green-500',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNoteBody = {
        ...notes,
        title: titleFormatter(autoNote.titleFormat),
        notebook_ref_id: autoNote.autoNoteNotebookID,
        body: JSON.stringify(autoNote.template.body.blocks),
      };
      const notesResponse = await axios.post(
        `${process.env.API}/api/notes/create`,
        newNoteBody,
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      dispatch(setNotes(notesResponse.data.result));

      const autoNoteResponse = await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        { noteGenerated: autoNote.noteGenerated + 1 },
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      dispatch(setAutoNotes(autoNoteResponse.data.result));
      toast({
        description: 'New Note created successfully',
        className: 'bg-green-500',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48">
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
            onClick={handleCreateNote}
            className="flex justify-between items-center"
          >
            Create note now <SquarePlus className="h-4 w-5" />
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
