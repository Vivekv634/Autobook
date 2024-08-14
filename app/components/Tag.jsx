'use client';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Note from '@/app/components/Note';
import { AccordionHeader } from '@radix-ui/react-accordion';

export default function Tag({ tagName, tagNotes, notesDocID, notebooks }) {
  return (
    <AccordionItem key={tagName} value={tagName}>
      <AccordionHeader>
        <AccordionTrigger>{tagName}</AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        {tagNotes.map((note, index) => {
          return (
            <Note
              key={index}
              notesDocID={notesDocID}
              notebook_name={notebooks[note.notebook_ref_id]}
              note={note}
            />
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
