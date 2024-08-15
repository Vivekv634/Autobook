import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Book, EllipsisVertical, PenOff, PinIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import NoteDropDownMenu from './NoteDropDownMenu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const Note = ({ note, notesDocID, notebook_name }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const timeAgo = formatDistanceToNowStrict(note.updation_date, {
    addSuffix: true,
  });

  if (isDesktop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="truncate">{note.title}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              {notebook_name && (
                <Link href={`/dashboard/notebooks/${note.notesbook_ref_id}`}>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    {notebook_name}
                  </Badge>
                </Link>
              )}
              {note.isPinned && <PinIcon className="h-4 w-5 text-green-400" />}
              {note.isReadOnly && (
                <PenOff className="h-4 w-5 text-orange-400" />
              )}
              {note.isFavorite && <Star className="h-4 w-5 text-red-400" />}
            </div>
            {timeAgo}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="my-1">
      <CardContent className="">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <div className="truncate">{note.title}</div>
            <NoteDropDownMenu note={note} notesDocID={notesDocID}>
              <EllipsisVertical className="h-9 w-6 min-w-6 border rounded-sm" />
            </NoteDropDownMenu>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            {notebook_name && (
              <Link href={`/dashboard/notebooks/${note.notesbook_ref_id}`}>
                <Badge variant="outline" className="flex items-center">
                  <Book className="h-3 w-4 p-0 m-0" />
                  {notebook_name}
                </Badge>
              </Link>
            )}
            {note.isPinned && <PinIcon className="h-4 w-5 text-green-400" />}
            {note.isReadOnly && <PenOff className="h-4 w-5 text-orange-400" />}
            {note.isFavorite && <Star className="h-4 w-5 text-red-400" />}
          </div>
          <Label className="flex items-center">{timeAgo}</Label>
        </div>
      </CardContent>
      <CardFooter
        className={cn(
          'flex flex-col items-start',
          note?.tagsList?.length > 0 ? 'block' : 'hidden',
        )}
      >
        <Separator />
        <div className="w-full flex flex-wrap ">
          {note.tagsList &&
            note.tagsList.map((tag, index) => {
              return (
                <Link
                  className="pr-1 underline text-sm"
                  key={index}
                  href={`/dashboard/tags#${tag}`}
                >{`#${tag}`}</Link>
              );
            })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Note;
