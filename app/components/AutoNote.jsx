import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Book } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNowStrict } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import AutoNoteContextMenu from './AutoNoteContextMenu';

const AutoNote = ({ autoNote }) => {
  const autoNoteUpdationTimeAgo = formatDistanceToNowStrict(
    autoNote?.autoNoteUpdationDate,
    { addSuffix: true },
  );
  const noteGeneratedTimeAgo = formatDistanceToNowStrict(
    autoNote?.lastNoteGenerationTime,
    { addSuffix: true },
  );
  const { notebooks } = useSelector((state) => state.note);

  return (
    <TooltipProvider>
      <Card id={autoNote.autoNoteID} className="my-1 cursor-pointer">
        <AutoNoteContextMenu autoNote={autoNote}>
          <CardContent className="cursor-pointer">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate h-fit z-10">
                      {autoNote.autoNoteName}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{autoNote.autoNoteName}</TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <div className="flex justify-between w-full">
              <div>
                {autoNote.autoNoteNotebookID && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/notebooks/#${autoNote.autoNoteNotebookID}`}
                        >
                          <Badge
                            variant="outline"
                            className="flex items-center"
                          >
                            <Book className="h-3 w-4 p-0 m-0" />
                            {
                              notebooks[autoNote.autoNoteNotebookID]
                                ?.notebookName
                            }
                          </Badge>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        Go to{' '}
                        {notebooks[autoNote.autoNoteNotebookID]?.notebookName}
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
              <div>{autoNoteUpdationTimeAgo}</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col text-[.94rem]">
            <Separator />
            <div className="flex justify-between w-full">
              <div>Note Generated {noteGeneratedTimeAgo} </div>
              <div className="text-nowrap">
                Period : {autoNote.noteGenerationPeriod}
              </div>
            </div>
          </CardFooter>
        </AutoNoteContextMenu>
      </Card>
    </TooltipProvider>
  );
};

export default AutoNote;
