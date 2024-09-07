'use client';
import {
  Code,
  Copy,
  Heading,
  Printer,
  RotateCcw,
  SquareArrowOutUpRight,
  Trash2,
  Type,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDeletedNotes, setNotes } from '../redux/slices/noteSlice';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { uid } from 'uid';
import { usePathname } from 'next/navigation';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import editorJsToHtml from '../utils/editorJSToHTML';

export default function NoteContextMenu({ children, notesDocID, note }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();

  const setEditorNoteState = () => {
    router.push(`/dashboard/${notesDocID}/${note.noteID}`);
  };

  const updateNote = async (props) => {
    let body, toastMessage;
    switch (props) {
      case 'isPinned':
        body = { isPinned: !note.isPinned };
        toastMessage = {
          description: !note.isPinned ? 'Note pinned!' : 'Note unpinned!',
        };
        break;
      case 'isReadOnly':
        body = { isReadOnly: !note.isReadOnly };
        toastMessage = {
          description: !note.isReadOnly
            ? 'Note marked as read-only!'
            : 'Note is editable again!',
        };
        break;
      case 'moveToTrash':
        body = { isTrash: !note.isTrash };
        toastMessage = { description: 'Note moved to trash!' };
        break;
      default:
        body = { isFavorite: !note.isFavorite };
        toastMessage = {
          description: !note.isFavorite
            ? 'Note added to favorites!'
            : 'Note removed from favorites!',
        };
        break;
    }
    try {
      const response = await axios.put(
        `${process.env.API}/api/notes/update/${note.noteID}`,
        body,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(response.data.result));
      toast({ ...toastMessage, className: 'bg-green-500 text-white' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const restoreNote = async () => {
    try {
      const body = { isTrash: false };
      const restoreResponse = await axios.put(
        `${process.env.API}/api/notes/update/${note.noteID}`,
        body,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(restoreResponse.data.result));
      let filterDeletedNotes = restoreResponse.data.result.filter(
        (note) => note.isTrash === true,
      );
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note restored!' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const deleteNote = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.API}/api/notes/delete/${note.noteID}`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      const filterDeletedNotes = deleteResponse.data.result.filter(
        (note) => note.isTrash === true,
      );
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note deleted forever!' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const duplicateNote = async () => {
    let body = { ...note, updation_date: new Date().toString(), noteID: uid() };
    const duplicateResponse = await axios.post(
      `${process.env.API}/api/notes/create`,
      body,
      {
        headers: {
          notesDocID: notesDocID,
        },
      },
    );
    dispatch(setNotes(duplicateResponse.data.result));
    toast({ description: 'Note duplicated!', className: 'bg-green-500' });
  };
  const handleCopyAsHTML = () => {
    const body = JSON.parse(note.body);
    const result = editorJsToHtml(body.blocks);
    console.log(result);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {pathName.split('/')[2] != 'trash' ? (
        <ContextMenuContent className="min-w-48">
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={setEditorNoteState}
          >
            Edit
            <SquareArrowOutUpRight className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={note.isPinned}
            onClick={() => updateNote('isPinned')}
          >
            Pin
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={note.isReadOnly}
            onClick={() => updateNote('isReadOnly')}
          >
            Read Only
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={note.isFavorite}
            onClick={() => updateNote('isFavorite')}
          >
            Favorite
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="flex justify-between items-center">
            Print
            <Printer className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem className="flex justify-between items-center">
                Markdown <Heading className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem className="flex justify-between items-center">
                HTML <Code className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem className="flex justify-between items-center">
                Text <Type className="h-4 w-5" />
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Copy as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem className="flex justify-between items-center">
                Markdown <Heading className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={handleCopyAsHTML}
              >
                HTML <Code className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem className="flex justify-between items-center">
                Text <Type className="h-4 w-5" />
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={duplicateNote}
          >
            Duplicate
            <Copy className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="flex justify-between items-center text-red-500"
            onClick={() => updateNote('moveToTrash')}
          >
            Move to trash
            <Trash2 className="h-4 w-5" />
          </ContextMenuItem>
        </ContextMenuContent>
      ) : (
        <ContextMenuContent>
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={restoreNote}
          >
            Restore
            <RotateCcw className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="flex justify-between items-center text-red-500"
            onClick={deleteNote}
          >
            Delete
            <Trash2 className="h-4 w-5" />
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
