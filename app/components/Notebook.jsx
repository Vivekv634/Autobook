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
import { ArrowDownToLine, Ellipsis, Pen, Trash2 } from 'lucide-react';
import DeleteNotebookAlertDialog from './DeleteNotebookAlertDialog';
import EditNotebookNameAlertDialog from './EditNotebookNameAlertDialog';
import ExportNotebookDialog from './ExportNotebookDialog';
import { useState } from 'react';

export function Notebook({ notebooks, notebook_id, notes, notesDocID }) {
  const [open, setOpen] = useState(false);
  return (
    <AccordionItem key={notebook_id} value={notebook_id}>
      <AccordionHeader className="flex justify-between px-3 items-center w-full">
        <AccordionTrigger
          className="min-w-full mr-2 font-semibold"
          id={notebook_id}
        >
          {notebooks[notebook_id].notebookName}
        </AccordionTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="min-h-7 min-w-9 border rounded-md" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-7">
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <EditNotebookNameAlertDialog
                notebookName={notebooks[notebook_id].notebookName}
                notebook_id={notebook_id}
                notesDocID={notesDocID}
                notebooks={notebooks}
              >
                Edit Name <Pen className="w-4 h-4" />
              </EditNotebookNameAlertDialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex justify-between pr-6"
              onClick={() => setOpen(true)}
            >
              Export Notebook <ArrowDownToLine className="w-4 h-4" />
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
          <ExportNotebookDialog
            open={open}
            setOpen={setOpen}
            notes={notes}
            notebook_id={notebook_id}
          />
        </DropdownMenu>
      </AccordionHeader>
      <AccordionContent>
        {notes.length > 0 ? (
          notes.map((note, index) => {
            return (
              <Note
                key={index}
                notesDocID={notesDocID}
                notebook_name={notebooks[notebook_id].notebookName}
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
