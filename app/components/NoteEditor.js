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
import EditorJS from '@editorjs/editorjs';
import axios from 'axios';
import { Pen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { editorConfig } from '../utils/editorConfig';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';

const NoteEditor = ({ params, readOnly, noteData }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { notebooks, user, notes } = useSelector((state) => state.note);
  const [editorNote, setEditorNote] = useState();
  const { noteID, notesDocID } = params;
  const toast = useCustomToast();
  const [noteTitle, setNoteTitle] = useState();
  const [tagsEditable, setTagsEditable] = useState(false);
  const [noteTagsInput, setNoteTagsInput] = useState();
  const [loading, setLoading] = useState(false);
  const [notebookValue, setNotebookValue] = useState();
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (noteData) {
      setEditorNote(noteData);
      setNoteTitle(editorNote?.title);
      setNoteTagsInput(editorNote?.tagsList?.join(' ') || '');
      setNotebookValue(
        notebooks[editorNote?.notebook_ref_id]
          ? editorNote?.notebook_ref_id
          : 'none',
      );
    } else {
      notes.map((note) => {
        if (note.noteID === noteID) {
          setEditorNote(note || noteData);
          setNoteTitle(editorNote?.title);
          setNoteTagsInput(editorNote?.tagsList?.join(' ') || '');
          setNotebookValue(
            notebooks[editorNote?.notebook_ref_id]
              ? editorNote?.notebook_ref_id
              : 'none',
          );
        }
      });
    }
  }, [
    notes,
    noteID,
    editorNote?.title,
    editorNote?.tagsList,
    editorNote?.notebook_ref_id,
    notebooks,
    noteData,
  ]);

  useEffect(() => {
    if (!editorNote?.body) return;
    const editor = new EditorJS({
      ...editorConfig,
      readOnly: readOnly || editorNote?.isReadOnly,
      data: JSON.parse(editorNote?.body || '{}'),
    });
    setEditorInstance(editor);
    return () => {
      if (editor) {
        if (typeof editor.destroy === 'function') {
          editor.destroy();
        } else {
          setEditorInstance(null);
        }
      }
    };
  }, [editorNote?.body, editorNote?.isReadOnly, readOnly]);

  const save = useCallback(async () => {
    if (!editorInstance) return;
    setLoading(true);
    try {
      const outputData = await editorInstance.save();
      const body = {
        body: JSON.stringify(outputData),
        title: noteTitle,
        tagsList: noteTagsInput.split(' ').filter((tag) => tag.trim() !== ''),
        notebook_ref_id: notebookValue,
      };
      await axios.put(`${process.env.API}/api/notes/update/${noteID}`, body, {
        headers: { notesDocID },
      });
      toast({ description: 'Changes Saved!', color: user?.userData?.theme });
    } catch (error) {
      console.error('Saving failed: ', error);
      toast({
        description: 'Saving failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [
    editorInstance,
    noteTitle,
    noteTagsInput,
    notebookValue,
    noteID,
    notesDocID,
    toast,
    user?.userData?.theme,
  ]);
  return (
    <section className="h-full box-border">
      <ScrollArea>
        <div
          className={cn(
            !isDesktop &&
              'flex items-center mt-4 mb-1 mx-1 justify-between print:hidden',
            isDesktop && 'flex justify-end gap-2 my-4 print:hidden',
          )}
        >
          <div>
            <Select
              value={notebookValue}
              onValueChange={setNotebookValue}
              disabled={loading || readOnly}
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
            disabled={loading || readOnly}
            className="disabled:cursor-not-allowed font-semibold"
            onClick={save}
          >
            <ButtonLoader loading={loading} label="Save changes" />
          </Button>
        </div>
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
            disabled={loading || readOnly}
            id="noteTitle"
            className="bg-transparent px-1 outline-none border-none text-2xl font-semibold w-full truncate"
          />
          <Label htmlFor="noteTitle">
            <Pen className="h-5 w-5" />
          </Label>
        </div>
        <div className="w-full px-2 mb-3 print:hidden">
          <Label
            className={cn(
              'flex flex-wrap items-center gap-1 cursor-pointer',
              tagsEditable && 'hidden',
            )}
            onClick={() => setTagsEditable(true)}
          >
            {noteTagsInput ? (
              noteTagsInput
                ?.split(' ')
                .filter((tag) => tag.trim() !== '')
                .map((tag) => `#${tag}`)
                .join(' ')
            ) : (
              <>Add tags </>
            )}
            <Pen className="h-3 w-3" />
          </Label>
          <Input
            autoFocus
            onBlur={() => setTagsEditable(false)}
            value={noteTagsInput}
            onChange={(e) => setNoteTagsInput(e.target.value)}
            disabled={loading || !tagsEditable || readOnly}
            className={cn(!tagsEditable && 'hidden')}
          />
        </div>
        <div
          id="editorjs"
          className={cn(
            !isDesktop && 'mx-1 px-1',
            isDesktop && 'px-10 py-4 ',
            'border rounded-md',
          )}
        />
        <ScrollBar />
      </ScrollArea>
    </section>
  );
};

export default NoteEditor;
