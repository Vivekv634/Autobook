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
import { PenLine, Trash2 } from 'lucide-react';
import EditAutoNoteDialog from './EditAutoNoteDialog';
import { useState } from 'react';
import DeleteAutoNoteDialog from './DeleteAutoNoteDialog';
import { state } from '../utils/schema';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { setAutoNotes } from '../redux/slices/noteSlice';

const AutoNoteDropDownMenu = ({ autoNote, children }) => {
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
