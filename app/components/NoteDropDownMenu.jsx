"use client"
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSubContent, DropdownMenuSub, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu"
import { Check, Code, Copy, Heading, Pen, PenLine, Printer, RotateCcw, SquareArrowOutUpRight, Trash2, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDeletedNotes, setEditorNote, setNotes, setNoteUpdate } from '../redux/slices/noteSlice';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import ExportPdfDialog from './ExportPdfDialog';
import { uid } from 'uid';
import NoteConfigDialog from './NoteConfigDialog';


const NoteDropDownMenu = ({ note, notesDocID, children }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  const setEditorNoteState = () => {
    dispatch(setEditorNote(note));
    router.push(`/dashboard/${notesDocID}/${note.noteID}`)
  }

  const updateNote = async (props) => {
    let body, toastMessage;
    switch (props) {
      case 'isPinned':
        body = { 'isPinned': !note.isPinned };
        toastMessage = { description: !note.isPinned ? 'Note pinned!' : 'Note unpinned!' }
        break;
      case 'isReadOnly':
        body = { 'isReadOnly': !note.isReadOnly };
        toastMessage = { description: !note.isReadOnly ? 'Note marked as read-only!' : 'Note is editable again!' };
        break;
      case 'moveToTrash':
        body = { 'isTrash': !note.isTrash };
        toastMessage = { description: 'Note moved to trash!' };
        break;
      default:
        body = { 'isFavorite': !note.isFavorite };
        toastMessage = { description: !note.isFavorite ? 'Note added to favorites!' : 'Note removed from favorites!' };
        break;
    }
    try {
      const response = await axios.put(`${process.env.API}/api/notes/update/${note.noteID}`, body, {
        headers: {
          notesDocID: notesDocID
        }
      });
      dispatch(setNotes(response.data.result));
      dispatch(setNoteUpdate(true));
      toast({ ...toastMessage, className: 'bg-green-400' });
    } catch (error) {
      console.error(error);
      toast({ description: 'Oops! Something went wrong. Try again!', variant: 'destructive' });
    }
  }

  const restoreNote = async () => {
    try {
      const body = { isTrash: false };
      const restoreResponse = await axios.put(`${process.env.API}/api/notes/update/${note.noteID}`, body, {
        headers: {
          notesDocID: notesDocID
        }
      });
      dispatch(setNotes(restoreResponse.data.result));
      dispatch(setNoteUpdate(true));
      let filterDeletedNotes = restoreResponse.data.result.filter(note => note.isTrash === true);
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note restored!' });
    } catch (error) {
      console.error(error);
      toast({ description: 'Oops! Something went wrong. Try again!', variant: 'destructive' });
    }
  }

  const deleteNote = async () => {
    try {
      const deleteResponse = await axios.delete(`${process.env.API}/api/notes/delete/${note.noteID}`, {
        headers: {
          notesDocID: notesDocID
        }
      })
      const filterDeletedNotes = deleteResponse.data.result.filter(note => note.isTrash === true);
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note deleted forever!' });
    } catch (error) {
      console.error(error);
      toast({ description: 'Oops! Something went wrong. Try again!', variant: 'destructive' });
    }
  }

  const duplicateNote = async () => {
    let body = { ...note, updation_date: new Date().toString(), noteID: uid() };
    const duplicateResponse = await axios.post(`${process.env.API}/api/notes/create`, body, {
      headers: {
        notesDocID: notesDocID
      }
    });
    dispatch(setNotes(duplicateResponse.data.result));
    toast({ description: 'Note duplicated!', className: 'bg-green-400' })

  }
  // NOTE: add move to vault option to the drop down menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      {!note.isTrash ?
        <DropdownMenuContent className='w-44 mr-2'>
          <DropdownMenuItem className='flex justify-between items-center' onClick={setEditorNoteState}>
            Open <SquareArrowOutUpRight className='h-4 w-5' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex justify-between items-center' onClick={() => updateNote('isPinned')}>
            Pin
            {note.isPinned && <Check className='h-4 w-5' />}
          </DropdownMenuItem>
          <DropdownMenuItem className='flex justify-between items-center' onClick={() => updateNote('isReadOnly')}>
            Read Only
            {note.isReadOnly && <Check className='h-4 w-5' />}
          </DropdownMenuItem>
          <DropdownMenuItem className='flex justify-between items-center' onClick={() => updateNote('isFavorite')}>
            Favorite
            {note.isFavorite && <Check className='h-4 w-5' />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex justify-between items-center'>
            Print
            <Printer className='h-4 w-5' />
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Export as
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <ExportPdfDialog note={note} />
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-between items-center'>
                Markdown
                <Heading className='h-4 w-5' />
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-between items-center'>
                HTML
                <Code className='h-4 w-5' />
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-between items-center'>
                Text
                <Type className='h-4 w-5' />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Copy as
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem className='flex justify-between items-center'>
                Markdown
                <Heading className='h-4 w-5' />
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-between items-center'>
                HTML
                <Code className='h-4 w-5' />
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-between items-center'>
                Text
                <Type className='h-4 w-5' />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem className='flex justify-between items-center' onClick={duplicateNote}>
            Duplicate
            <Copy className='h-4 w-5' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex justify-between items-center text-red-500' onClick={() => updateNote('moveToTrash')}>
            Move to Trash
            <Trash2 className='h-4 w-5' />
          </DropdownMenuItem>
        </DropdownMenuContent>
        :
        <DropdownMenuContent className='w-44'>
          <DropdownMenuItem className='flex justify-between items-center' onClick={restoreNote}>
            Restore
            <RotateCcw className='h-4 w-5' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex justify-between items-center text-red-500' onClick={deleteNote}>
            Delete forever
            <Trash2 className='h-4 w-5' />
          </DropdownMenuItem>
        </DropdownMenuContent>}
    </DropdownMenu >
  )
}

export default NoteDropDownMenu;
