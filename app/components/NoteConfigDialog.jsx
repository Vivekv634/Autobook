'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { PenLine } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const NoteConfigDialog = ({ note }) => {
  const [title, setTitle] = useState(note.title);
  const [tags, setTags] = useState(
    note.tagsList.length > 0 ? note.tagsList.join(' ') : '',
  );
  const [isLocked, setIsLocked] = useState(note.isLocked);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let newTagsList = tags.split(' ').filter((tag) => tag.trim() !== '');
    const body = {
      title: title,
      tagsList: newTagsList,
      isLocked: isLocked,
    };
    console.log(body);
  };

  return (
    <Dialog
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DialogTrigger asChild>
        <span
          className="cursor-pointer flex justify-between items-center w-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Edit <PenLine className="h-4 w-5" />
        </span>
      </DialogTrigger>
      <DialogContent
        aria-describedby={note.title}
        className="w-11/12 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle id={note.title}>Edit Note</DialogTitle>
        <DialogDescription>
          Edit your note title and other things. Save changes when you done.
        </DialogDescription>
        <form
          onSubmit={handleFormSubmit}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Label
              htmlFor="title"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Note Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Label
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Edit Tags list
            </Label>
            <Input
              placeholder="tag1 tag2 ..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <Label
              className="text-[.685rem] font-normal text-neutral-600"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Add multiple tags by spaces between them
            </Label>
          </div>
          <div className="flex justify-between py-2 items-center mt-2">
            <Label>Note Lock</Label>
            <Switch checked={isLocked} onCheckedChange={setIsLocked} />
          </div>
          <div className="flex justify-between mt-2">
            <Button className="w-[48%]" variant="outline">
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button className="w-[48%]" type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteConfigDialog;
