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
import { Book, PenOff, PinIcon, Star } from 'lucide-react';
import Link from 'next/link';
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
  const timeAgo = formatDistanceToNowStrict(note.updation_date, {
    addSuffix: true,
  });

  return (
    <TooltipProvider>
      <Card className="h-fit">
        <NoteContextMenu note={note} notesDocID={notesDocID}>
          <CardContent className="cursor-pointer">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{note.title}</div>
                  </TooltipTrigger>
                  <TooltipContent>{note.title}</TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <div className="flex justify-between w-full">
              <div className="flex items-center">
                {notebook_name && (
                  <>
                    <Tooltip>
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
                    </Tooltip>
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
            <CardFooter
              className={cn(
                'flex flex-col items-start p-0 pt-1',
                note?.tagsList?.length > 0 ? 'block' : 'hidden',
              )}
            >
              <Separator />
              <div className="w-full flex flex-wrap gap-2">
                {note.tagsList &&
                  note.tagsList.map((tag, index) => {
                    return (
                      <Link
                        className="transition-all underline text-sm hover:text-green-500"
                        key={index}
                        href={`/dashboard/tags#${tag}`}
                      >
                        {`#${tag}`}
                      </Link>
                    );
                  })}
              </div>
            </CardFooter>
          </CardContent>
        </NoteContextMenu>
      </Card>
    </TooltipProvider>
  );
};

export default Note;
