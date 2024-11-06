import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMediaHook } from '@/app/utils/mediaHook';
import { uid } from 'uid';
import axios from 'axios';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';

export default function NoteConfigDialog({ note, open, setOpen }) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [noteTitle, setNoteTitle] = useState(note.title);
  const [tags, setTags] = useState(note?.tagsList.join(' ') || '');
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookFlag, setNewNotebookFlag] = useState(false);
  const [Notebook, setNotebook] = useState(note.notebook_ref_id ?? 'none');
  const [tagsPreview, setTagsPreview] = useState('');
  const [notebookNamePreview, setNotebookNamePreview] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const { notebooks, user } = useSelector((state) => state.note);

  useEffect(() => {
    if (newNotebookName != '') {
      setNotebookNamePreview(
        newNotebookName
          .split(' ')
          .filter((word) => word.trim())
          .join(' '),
      );
    } else {
      setNotebookNamePreview('');
    }
    if (tags != '') {
      setTagsPreview(
        tags
          .split(' ')
          .filter((tag) => tag.trim())
          .map((tag) => `#${tag}`)
          .join(' '),
      );
    } else {
      setTagsPreview('');
    }
  }, [tags, newNotebookName]);

  useEffect(() => {
    const notebookNames = Object.values(notebooks).map((notebook) => {
      return notebook.notebookName;
    });
    if (notebookNames.includes(newNotebookName.trim())) {
      setError(`${newNotebookName} notebook is already exists!`);
    } else {
      setError(null);
    }
  }, [newNotebookName, notebooks]);

  async function handleUpdateNote(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const notebookID = uid();
      const TAGS = tags.split(' ').filter((tag) => tag.trim());
      let noteBody = {
          title: noteTitle,
          tagsList: TAGS,
        },
        newNotebookBody;

      if (newNotebookFlag && newNotebookName.trim() != '') {
        noteBody['notebook_ref_id'] = notebookID;
        newNotebookBody = {
          notebookID,
          notebookName: newNotebookName
            .split(' ')
            .filter((word) => word.trim())
            .join(' '),
          usedInTemplate: false,
        };
      } else if (!newNotebookFlag && Notebook != 'none') {
        noteBody['notebook_ref_id'] = Notebook;
      } else if (!newNotebookFlag && Notebook == 'none') {
        noteBody['notebook_ref_id'] = null;
      }
      if (newNotebookBody != undefined) {
        await axios.post(
          `${process.env.API}/api/notebooks/create`,
          newNotebookBody,
          { headers: { notesDocID: user?.userData?.notesDocID } },
        );
      }
      await axios.put(
        `${process.env.API}/api/notes/update/${note.noteID}`,
        noteBody,
        {
          headers: { notesDocID: user?.userData?.notesDocID },
        },
      );
      setNewNotebookName('');
      setLoading(false);
      setOpen(false);
      toast({
        description: 'Note updated successfully!',
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setOpen(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Edit your note configuration. Save changes when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleUpdateNote(e)}>
          <div>
            <Label htmlFor="noteTitle">
              Note Title{' '}
              <span className="text-muted-foreground text-[.8rem]">
                (Required)
              </span>
            </Label>
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              id="noteTitle"
              required
            />
          </div>
          <div className="my-2">
            <Label htmlFor="tags">
              Tags{' '}
              <span className="text-muted-foreground text-[.8rem]">
                (Multiple with spaces)
              </span>
            </Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              id="tags"
              placeholder="tag1 tag2 ..."
            />
            <Label
              className={cn(tags == '' && 'hidden', 'text-muted-foreground')}
            >
              Preview: {tagsPreview}
            </Label>
          </div>
          <div className={cn(newNotebookFlag && 'hidden')}>
            <Label>Select Notebook</Label>
            <Select
              value={Notebook}
              onValueChange={(e) => setNotebook(e)}
              disabled={newNotebookFlag}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="top" align="end">
                <SelectItem value="none" key="none" className="text-red-400">
                  Select Notebook
                </SelectItem>
                {Object.keys(notebooks).map((notebook_id, index) => {
                  return (
                    <SelectItem value={notebook_id} key={index}>
                      {notebooks[notebook_id].notebookName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className={cn(!newNotebookFlag && 'hidden')}>
            <Label>New Notebook Name</Label>
            <Input
              placeholder="Enter New Notebook Name..."
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              disabled={!newNotebookFlag}
            />
            <Label
              className={cn(
                (newNotebookName == '' || newNotebookName.trim() == '') &&
                  'hidden',
                'text-muted-foreground block mt-1',
              )}
            >
              Preview: {notebookNamePreview}
            </Label>
            <Label className="text-red-400">{error}</Label>
          </div>
          <div className="flex items-center gap-1 my-2">
            <Checkbox
              checked={newNotebookFlag}
              onCheckedChange={setNewNotebookFlag}
              id="newNotebook"
              disabled={Object.keys(notebooks).length == 0}
            />
            <Label htmlFor="newNotebook">Create a new Notebook</Label>
          </div>
          <DialogFooter>
            <DialogClose
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </DialogClose>
            <Button
              className={cn(!isDesktop && 'my-2', 'font-semibold')}
              disabled={loading || error || noteTitle == ''}
              type="submit"
            >
              <ButtonLoader loading={loading} label="Save Changes" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
