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
import { cn } from '@/lib/utils';
import { AccordionHeader } from '@radix-ui/react-accordion';
import { ArrowDownToLine, Ellipsis, Pen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import fontClassifier from '../utils/font-classifier';
import DeleteNotebookDialog from './DeleteNotebookAlertDialog';
import EditNotebookNameAlertDialog from './EditNotebookNameAlertDialog';
import ExportNotebookDialog from './ExportNotebookDialog';

export function Notebook({ notebooks, notebook_id, notes, notesDocID }) {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.note);
  const [alsoDeleteNotes, setAlsoDeleteNotes] = useState(false);
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false);

  return (
    <AccordionItem key={notebook_id} value={notebook_id}>
      <AccordionHeader className="flex justify-between px-3 items-center w-full">
        <AccordionTrigger
          className="min-w-full mr-2 font-semibold"
          id={notebook_id}
        >
          {notebooks[notebook_id].notebookName}
        </AccordionTrigger>
        <DropdownMenu onOpenChange={setDropDownMenuOpen}>
          <DropdownMenuTrigger>
            <Ellipsis className="min-h-7 min-w-9 border rounded-md" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(fontClassifier(user?.userData?.font), 'mr-7')}
          >
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
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Export Notebook <ArrowDownToLine className="w-4 h-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-between pr-6 text-red-600"
              onClick={() => setAlsoDeleteNotes(true)}
            >
              Delete notebook <Trash2 className="w-4 h-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
          <ExportNotebookDialog
            isDropDownMenuOpen={dropDownMenuOpen}
            open={open}
            setOpen={setOpen}
            notes={notes}
            notebook_id={notebook_id}
          />
          <DeleteNotebookDialog
            isDropDownMenuOpen={dropDownMenuOpen}
            open={alsoDeleteNotes}
            setOpen={setAlsoDeleteNotes}
            notebook_id={notebook_id}
            notebookName={notebooks[notebook_id].notebookName}
          />
        </DropdownMenu>
      </AccordionHeader>
      <AccordionContent className="flex flex-col gap-2">
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
          <div className="bg-neutral-800 flex align-center justify-center rounded-md px-2 py-4 text-lg">
            Notebook is empty!
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
