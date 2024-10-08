'use client';
import {
  Code,
  Copy,
  Heading,
  PenLine,
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
import CopyAsHTMLDialog from './CopyAsHTMLDialog';
import { useState } from 'react';
import CopyAsMarkdownDialog from './CopyAsMarkdownDialog';
import CopyAsTextDialog from './CopyAsTextDialog';
import ExportAsTextDialog from './ExportAsTextDialog';
import ExportAsHTMLDialog from './ExportAsHTMLDialog';
import ExportAsMarkdownDialog from './ExportAsMarkdownDialog';
import NotePrintDialog from './NotePrintDialog';
import NoteConfigDialog from './NoteConfigDialog';

export default function NoteContextMenu({ children, notesDocID, note }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const [copyAsHTML, setCopyAsHTML] = useState(false);
  const [copyAsText, setCopyAsText] = useState(false);
  const [copyAsMarkdown, setCopyAsMarkdown] = useState(false);
  const [exportAsHTML, setExportAsHTML] = useState(false);
  const [exportAsText, setExportAsText] = useState(false);
  const [exportAsMarkdown, setExportAsMarkdown] = useState(false);
  const [printNote, setPrintNote] = useState(false);
  const [noteConfigDialog, setNoteConfigDialog] = useState(false);

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
      toast({ ...toastMessage, className: 'bg-green-500' });
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

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {pathName.split('/')[2] != 'trash' ? (
        <ContextMenuContent className="min-w-48">
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={setEditorNoteState}
          >
            Open Note
            <SquareArrowOutUpRight className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={() => setNoteConfigDialog(true)}
          >
            Edit
            <PenLine className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={note.isPinned}
            onClick={() => updateNote('isPinned')}
          >
            {note.isPinned ? 'Pinned' : 'Pin'}
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
          <ContextMenuItem
            className="flex justify-between items-center"
            onClick={() => setPrintNote(true)}
          >
            Print
            <Printer className="h-4 w-5" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setExportAsMarkdown(true);
                }}
              >
                Markdown <Heading className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setExportAsHTML(true);
                }}
              >
                HTML <Code className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setExportAsText(true);
                }}
              >
                Text <Type className="h-4 w-5" />
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Copy as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setCopyAsMarkdown(true);
                }}
              >
                Markdown <Heading className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setCopyAsHTML(true);
                }}
              >
                HTML <Code className="h-4 w-5" />
              </ContextMenuItem>
              <ContextMenuItem
                className="flex justify-between items-center"
                onClick={() => {
                  setCopyAsText(true);
                }}
              >
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
      <CopyAsHTMLDialog
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={copyAsHTML}
        setOpen={setCopyAsHTML}
      />
      <CopyAsMarkdownDialog
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={copyAsMarkdown}
        setOpen={setCopyAsMarkdown}
      />
      <CopyAsTextDialog
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={copyAsText}
        setOpen={setCopyAsText}
      />
      <ExportAsTextDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={exportAsText}
        setOpen={setExportAsText}
      />
      <ExportAsMarkdownDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={exportAsMarkdown}
        setOpen={setExportAsMarkdown}
      />
      <ExportAsHTMLDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={exportAsHTML}
        setOpen={setExportAsHTML}
      />
      <NotePrintDialog
        html={editorJsToHtml(JSON.parse(note.body || '{}')?.blocks)}
        open={printNote}
        setOpen={setPrintNote}
      />
      <NoteConfigDialog
        note={note}
        open={noteConfigDialog}
        setOpen={setNoteConfigDialog}
      />
    </ContextMenu>
  );
}
