'use client';
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
import { cn } from '@/lib/utils';
import axios from 'axios';
import {
  Code,
  Copy,
  Heading,
  PenLine,
  Printer,
  RotateCcw,
  Share,
  SquareArrowOutUpRight,
  Trash2,
  Type,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { setDeletedNotes, setNotes } from '../redux/slices/noteSlice';
import editorJsToHtml from '../utils/editorJSToHTML';
import fontClassifier from '../utils/font-classifier';
import CopyAsHTMLDialog from './CopyAsHTMLDialog';
import CopyAsMarkdownDialog from './CopyAsMarkdownDialog';
import CopyAsTextDialog from './CopyAsTextDialog';
import ExportAsHTMLDialog from './ExportAsHTMLDialog';
import ExportAsMarkdownDialog from './ExportAsMarkdownDialog';
import ExportAsTextDialog from './ExportAsTextDialog';
import NoteConfigDialog from './NoteConfigDialog';
import NotePrintDialog from './NotePrintDialog';
import { useCustomToast } from './SendToast';
import ShareNoteDialog from './ShareNoteDialog';

export default function NoteContextMenu({ children, notesDocID, note }) {
  const toast = useCustomToast();
  const { user } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [copyAsHTML, setCopyAsHTML] = useState(false);
  const [copyAsText, setCopyAsText] = useState(false);
  const [copyAsMarkdown, setCopyAsMarkdown] = useState(false);
  const [exportAsHTML, setExportAsHTML] = useState(false);
  const [exportAsText, setExportAsText] = useState(false);
  const [exportAsMarkdown, setExportAsMarkdown] = useState(false);
  const [printNote, setPrintNote] = useState(false);
  const [noteConfigDialog, setNoteConfigDialog] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);

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
      toast({ ...toastMessage, color: user?.userData?.theme });
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
      toast({ description: 'Note restored!', color: user?.userData?.theme });
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
      toast({
        description: 'Note deleted forever!',
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const duplicateNote = async () => {
    try {
      let body = {
        ...note,
        updation_date: new Date().toString(),
        noteID: v4(),
      };
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
      toast({ description: 'Note duplicated!', color: user?.userData?.theme });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const FONT = fontClassifier(user?.userData?.font);

  return (
    <ContextMenu onOpenChange={setIsContextOpen}>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {pathName.split('/')[2] != 'trash' ? (
        <ContextMenuContent className={cn(FONT, 'min-w-48')}>
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
            onClick={() => setOpenShareDialog(true)}
          >
            Share
            <Share className="h-4 w-5" />
          </ContextMenuItem>
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
        html={editorJsToHtml(JSON.parse(note.body))}
        open={copyAsHTML}
        setOpen={setCopyAsHTML}
        isContextOpen={isContextOpen}
      />
      <CopyAsMarkdownDialog
        html={editorJsToHtml(JSON.parse(note.body))}
        open={copyAsMarkdown}
        setOpen={setCopyAsMarkdown}
        isContextOpen={isContextOpen}
      />
      <CopyAsTextDialog
        html={editorJsToHtml(JSON.parse(note.body))}
        open={copyAsText}
        isContextOpen={isContextOpen}
        setOpen={setCopyAsText}
      />
      <ExportAsTextDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body))}
        open={exportAsText}
        isContextOpen={isContextOpen}
        setOpen={setExportAsText}
      />
      <ExportAsMarkdownDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body))}
        open={exportAsMarkdown}
        setOpen={setExportAsMarkdown}
        isContextOpen={isContextOpen}
      />
      <ExportAsHTMLDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body))}
        open={exportAsHTML}
        setOpen={setExportAsHTML}
        isContextOpen={isContextOpen}
      />
      <NotePrintDialog
        open={printNote}
        html={editorJsToHtml(JSON.parse(note.body))}
        isContextOpen={isContextOpen}
        setOpen={setPrintNote}
      />
      <NoteConfigDialog
        isContextOpen={isContextOpen}
        note={note}
        open={noteConfigDialog}
        setOpen={setNoteConfigDialog}
      />
      <ShareNoteDialog
        user={user}
        isContextOpen={isContextOpen}
        noteID={note.noteID}
        notesDocID={notesDocID}
        open={openShareDialog}
        setOpen={setOpenShareDialog}
      />
    </ContextMenu>
  );
}
