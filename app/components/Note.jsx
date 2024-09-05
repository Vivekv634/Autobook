import {
  Card,
  CardContent,
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
import NoteContextMenu from './NoteContextMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Note = ({ note, notesDocID, notebook_name }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const timeAgo = formatDistanceToNowStrict(note.updation_date, {
    addSuffix: true,
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <Card className="my-1">
          <NoteContextMenu note={note} notesDocID={notesDocID}>
            <CardContent className="cursor-pointer">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center justify-between">
                  <TooltipTrigger asChild>
                    <div className="truncate">{note.title}</div>
                  </TooltipTrigger>
                  <TooltipContent>{note.title}</TooltipContent>
                  {!isDesktop && (
                    <NoteDropDownMenu note={note} notesDocID={notesDocID}>
                      <EllipsisVertical className="h-9 w-6 min-w-6 border rounded-sm" />
                    </NoteDropDownMenu>
                  )}
                </CardTitle>
              </CardHeader>
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  {notebook_name && (
                    <>
                      <TooltipTrigger>
                        <Link
                          href={`/dashboard/notebooks/#${note.notebook_ref_id}`}
                        >
                          <Badge
                            variant="outline"
                            className="flex items-center"
                          >
                            <Book className="h-3 w-4 p-0 m-0" />
                            {notebook_name}
                          </Badge>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Go to {notebook_name}</TooltipContent>
                    </>
                  )}
                  {note.isPinned && (
                    <PinIcon className="h-4 w-5 text-green-500" />
                  )}
                  {note.isReadOnly && (
                    <PenOff className="h-4 w-5 text-orange-500" />
                  )}
                  {note.isFavorite && <Star className="h-4 w-5 text-red-500" />}
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
                        className="pr-1 transition-all underline text-sm hover:text-green-500"
                        key={index}
                        href={`/dashboard/tags#${tag}`}
                      >{`#${tag}`}</Link>
                    );
                  })}
              </div>
            </CardFooter>
          </NoteContextMenu>
        </Card>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Note;
