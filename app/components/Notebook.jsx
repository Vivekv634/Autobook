'use client';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Note from '@/app/components/Note';
import { AccordionHeader } from '@radix-ui/react-accordion';
import { Ellipsis, Trash2, Pen } from 'lucide-react';
import EditNotebookNameAlertDialog from './EditNotebookNameAlertDialog';
import DeleteNotebookAlertDialog from './DeleteNotebookAlertDialog';

export function Notebook({ notebooks, notebook_id, notes, notesDocID }) {
  return (
    <AccordionItem key={notebook_id} value={notebook_id}>
      <AccordionHeader className="flex justify-between px-1 items-center w-full">
        <AccordionTrigger className="min-w-full mr-2">
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
          notes.map((note, index) => (
            <Note
              key={index}
              notesDocID={notesDocID}
              notebook_name={notebooks[notebook_id]}
              note={note}
            />
          ))
        ) : (
          <div className="">No notes here.</div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
