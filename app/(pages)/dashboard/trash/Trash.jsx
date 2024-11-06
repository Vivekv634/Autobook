'use client';
import DeleteAllTrashNotesAlertDialog from '@/app/components/DeleteAllTrashNotesAlertDialog';
import Note from '@/app/components/Note';
import RestoreAllTrashNotesAlertDialog from '@/app/components/RestoreAllTrashNotesAlertDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import TrashSVG from '@/public/trash.svg';

const TrashComponent = () => {
  const { deletedNotes, user, notebooks } = useSelector((state) => state.note);

  return (
    <section
      className={cn(
        'p-2 flex gap-2 flex-col',
        deletedNotes.length == 0 && 'items-center h-full justify-center',
      )}
    >
      {deletedNotes.length != 0 && (
        <>
          <div className="flex mb-2 gap-2">
            <RestoreAllTrashNotesAlertDialog>
              <Button>Restore all</Button>
            </RestoreAllTrashNotesAlertDialog>
            <DeleteAllTrashNotesAlertDialog>
              <Button variant="destructive">Delete All</Button>
            </DeleteAllTrashNotesAlertDialog>
          </div>
          {deletedNotes?.map((note, index) => {
            return (
              <Note
                key={index}
                note={note}
                notesDocID={user?.userData?.notesDocID}
                notebook_name={notebooks[note.notebook_ref_id]?.notebookName}
              />
            );
          })}
        </>
      )}
      {deletedNotes.length == 0 && (
        <div className="flex text-center h-inherit justify-center align-center">
          <div>
            <Image src={TrashSVG} alt="Empty bin!" loading="lazy" />
            <Label className="text-lg">Empty bin!</Label>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrashComponent;
