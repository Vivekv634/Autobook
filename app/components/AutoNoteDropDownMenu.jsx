'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PenLine,
  SquareArrowOutUpRight,
  SquarePlus,
  Trash2,
} from 'lucide-react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import { useState } from 'react';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';
import { notes, state } from '../utils/schema';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { titleFormatter } from '../utils/titleFormatter';
import { useRouter } from 'next/navigation';
import { uid } from 'uid';

const AutoNoteDropDownMenu = ({ autoNote, children }) => {
  const [deleteDialogOpen, setDeteleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { notebooks, user } = useSelector((state) => state.note);
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
        noteID: uid(),
        title: titleFormatter(autoNote.titleFormat, autoNote.noteGenerated),
        notebook_ref_id: autoNote.autoNoteNotebookID,
        body: autoNote.template.body.blocks,
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
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/dashboard/${user.userData.notesDocID}/auto-note/${autoNote.autoNoteID}/edit-template`,
              )
            }
            className="flex justify-between items-center"
          >
            Edit template
            <SquareArrowOutUpRight className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={autoNote.state}>
            {state.map((State, index) => {
              return (
                <DropdownMenuRadioItem
                  key={index}
                  value={State.value}
                  onClick={() => {
                    handleAutoNoteStateChange(State.value);
                  }}
                >
                  {State.label}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCreateNote}
            className="flex justify-between items-center"
          >
            Create note now <SquarePlus className="w-4 h-5" />
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
        notebooks={notebooks}
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
