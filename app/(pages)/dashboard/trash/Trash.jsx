'use client';
import DeleteAllTrashNotesAlertDialog from '@/app/components/DeleteAllTrashNotesAlertDialog';
import Note from '@/app/components/Note';
import RestoreAllTrashNotesAlertDialog from '@/app/components/RestoreAllTrashNotesAlertDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

const TrashComponent = () => {
  const { deletedNotes, user, notebooks } = useSelector((state) => state.note);

  return (
    <section
      className={cn(
        'p-2 flex flex-col',
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
                notesDocID={user.userData.notesDocID}
                notebook_name={notebooks[note.notebook_ref_id]?.notebookName}
              />
            );
          })}
        </>
      )}
      {deletedNotes.length == 0 && (
        <div className="flex items-center justify-between h-full text-3xl">
          Empty bin!
        </div>
      )}
    </section>
  );
};

export default TrashComponent;
