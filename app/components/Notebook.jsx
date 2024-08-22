'use client';
import Note from '@/app/components/Note';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AccordionHeader } from '@radix-ui/react-accordion';
import { Ellipsis, Pen, Trash2 } from 'lucide-react';
import DeleteNotebookAlertDialog from './DeleteNotebookAlertDialog';
import EditNotebookNameAlertDialog from './EditNotebookNameAlertDialog';

export function Notebook({ notebooks, notebook_id, notes, notesDocID }) {
  return (
    <AccordionItem key={notebook_id} value={notebook_id}>
      <AccordionHeader className="flex justify-between px-3 items-center w-full">
        <AccordionTrigger className="min-w-full mr-2" id={notebook_id}>
          {notebooks[notebook_id]}
        </AccordionTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="min-h-7 min-w-9 border rounded-md" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <EditNotebookNameAlertDialog
                notebookName={notebooks[notebook_id]}
                notebook_id={notebook_id}
                notesDocID={notesDocID}
              >
                Edit Name <Pen className="w-4 h-4" />
              </EditNotebookNameAlertDialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <DeleteNotebookAlertDialog
                notebook_id={notebook_id}
                notesDocID={notesDocID}
              >
                Delete notebook <Trash2 className="w-4 h-4" />
              </DeleteNotebookAlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </AccordionHeader>
      <AccordionContent>
        {notes.length > 0 ? (
          notes.map((note, index) => {
            return (
              <Note
                key={index}
                notesDocID={notesDocID}
                notebook_name={notebooks[notebook_id]}
                note={note}
              />
            );
          })
        ) : (
          <div className="">No notes here.</div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
