'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import EditorJS from '@editorjs/editorjs';
import axios from 'axios';
import { Loader2, Pen, PenLine } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { editorConfig } from '../utils/editor';

const NoteEditor = ({ params }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { notebooks, notes } = useSelector((state) => state.note);
  const [editorNote, setEditorNote] = useState();
  const { noteID, notesDocID } = params;
  const { toast } = useToast();
  const dispatch = useDispatch();
  const editorInstance = useRef(null);
  const [noteTitle, setNoteTitle] = useState();
  const [tagsEditable, setTagsEditable] = useState(false);
  const [noteTagsInput, setNoteTagsInput] = useState();
  const [loading, setLoading] = useState(false);
  const [notebookValue, setNotebookValue] = useState();

  useEffect(() => {
    notes.map((note) => {
      if (note.noteID === noteID) {
        setEditorNote(note);
        setNoteTitle(editorNote?.title);
        setNoteTagsInput(editorNote?.tagsList?.join(' ') || '');
        setNotebookValue(
          notebooks[editorNote?.notebook_ref_id]
            ? editorNote?.notebook_ref_id
            : 'none',
        );
      }
    });
  }, [
    notes,
    noteID,
    editorNote?.title,
    editorNote?.tagsList,
    editorNote?.notebook_ref_id,
    notebooks,
  ]);

  useEffect(() => {
    if (!editorNote?.body) return;

    const editor = new EditorJS({
      ...editorConfig,
      readOnly: editorNote?.isReadOnly,
      data: JSON.parse(editorNote?.body || '{}'),
    });

    editorInstance.current = editor;

    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
            editorInstance.current = null;
          })
          .catch((err) => {
            console.error('EditorJS cleanup error:', err);
          });
      }
    };
  }, [editorNote?.body, editorNote?.isReadOnly]);

  const save = useCallback(async () => {
    setLoading(true);
    try {
      const outputData = await editorInstance.current.save();
      const body = {
        body: JSON.stringify(outputData),
        title: noteTitle,
        tagsList: noteTagsInput.split(' ').filter((tag) => tag.trim() !== ''),
        notebook_ref_id: notebookValue,
      };
      const response = await axios.put(
        `${process.env.API}/api/notes/update/${noteID}`,
        body,
        { headers: { notesDocID } },
      );
      response?.data?.result?.forEach((note) => {
        if (note.noteID == noteID) {
          dispatch(setEditorNote(note));
        }
      });
      toast({ description: 'Changes Saved!', className: 'bg-green-400' });
    } catch (error) {
      console.error('Saving failed: ', error);
      toast({
        description: 'Saving failed. Please try again.',
        className: 'bg-red-400',
      });
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    noteID,
    noteTagsInput,
    noteTitle,
    notebookValue,
    notesDocID,
    toast,
  ]);

  return (
    <section className="h-full box-border">
      <ScrollArea>
        <div
          className={cn(
            !isDesktop &&
              'flex items-center mt-4 mb-1 mx-1 justify-between print:hidden',
            isDesktop && 'flex justify-end gap-2 print:hidden',
          )}
        >
          <div>
            <Select
              value={notebookValue}
              onValueChange={setNotebookValue}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none" className="text-red-400">
                  Select Notebook
                </SelectItem>
                {Object.keys(notebooks).map((notebook_id, index) => (
                  <SelectItem key={index} value={notebook_id}>
                    {notebooks[notebook_id].notebookName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={loading}
            className="disabled:cursor-not-allowed"
            onClick={save}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-[18px] animate-spin" /> Loading...
              </div>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
        <Separator className="my-2" />
        <div
          className={cn(
            'flex px-1 border rounded-md pr-4 items-center mb-3 print:hidden',
            !isDesktop && 'mx-1',
          )}
        >
          <Input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
            id="noteTitle"
            className="bg-transparent px-1 outline-none border-none text-2xl font-semibold w-full truncate"
          />
          <Label htmlFor="noteTitle">
            <Pen className="h-5 w-5" />
          </Label>
        </div>
        <div className="w-full px-2 mb-3 print:hidden">
          {noteTagsInput ? (
            !tagsEditable ? (
              <Label
                className="flex flex-wrap items-center gap-1 cursor-pointer"
                onClick={() => setTagsEditable(true)}
              >
                {noteTagsInput
                  .split(' ')
                  .filter((tag) => tag.trim() !== '')
                  .map((tag) => `#${tag}`)
                  .join(' ')}
                <Pen className="h-3 w-3" />
              </Label>
            ) : (
              <Input
                autoFocus
                onBlur={() => setTagsEditable(false)}
                value={noteTagsInput}
                onChange={(e) => setNoteTagsInput(e.target.value)}
              />
            )
          ) : (
            !tagsEditable && (
              <Label
                onClick={() => setTagsEditable(true)}
                className="flex gap-1 items-center cursor-pointer"
              >
                Add tags <PenLine className="h-3 w-3" />
              </Label>
            )
          )}
        </div>
        <div
          id="editorjs"
          className={cn(
            !isDesktop && 'mx-1 px-1',
            isDesktop && 'px-20 py-4 ',
            'border rounded-md',
          )}
        />
        <ScrollBar />
      </ScrollArea>
    </section>
  );
};

export default NoteEditor;
