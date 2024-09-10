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
import {
  PenLine,
  SquareArrowOutUpRight,
  SquarePlus,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';
import { notes, state } from '../utils/schema';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { titleFormatter } from '../utils/titleFormatter';
import { useRouter } from 'next/navigation';
import { uid } from 'uid';

const AutoNoteContextMenu = ({ autoNote, children }) => {
  const [deleteDialogOpen, setDeteleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { user, notebooks } = useSelector((state) => state.note);
  const { toast } = useToast();
  const router = useRouter();

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
      await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        updatedAutoNoteBody,
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      toast({
        description: (
          <span>
            <span className="font-bold">{autoNote.autoNoteName}</span> updated!
          </span>
        ),
        className: 'bg-green-600',
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
        noteID: uid(),
        title: titleFormatter(autoNote.titleFormat, autoNote.noteGenerated),
        notebook_ref_id: autoNote.autoNoteNotebookID,
        body: JSON.stringify(autoNote.template.body.blocks),
      };
      await axios.post(`${process.env.API}/api/notes/create`, newNoteBody, {
        headers: { notesDocID: user.userData.notesDocID },
      });

      await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        { noteGenerated: autoNote.noteGenerated + 1 },
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      toast({
        description: 'New Note created successfully',
        className: 'bg-green-600',
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
          <ContextMenuItem
            onClick={() =>
              router.push(
                `/dashboard/${user.userData.notesDocID}/auto-note/${autoNote.autoNoteID}/edit-template`,
              )
            }
            className="flex justify-between items-center"
          >
            Edit template
            <SquareArrowOutUpRight className="h-4 w-5" />
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
        notebooks={notebooks}
        autoNote={autoNote}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
      <DeleteAutoNoteDialog
        AutoNote={autoNote}
        open={deleteDialogOpen}
        setOpen={setDeteleDialogOpen}
      />
    </Dialog>
  );
};

export default AutoNoteContextMenu;
