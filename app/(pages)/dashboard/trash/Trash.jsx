'use client';
import Note from '@/app/components/Note';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';

const TrashComponent = () => {
  const { deletedNotes, user, notebooks } = useSelector((state) => state.note);
  const { toast } = useToast();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const restoreAll = async () => {
    try {
      await axios.get(`${process.env.API}/api/notes/restoreall`, {
        headers: {
          notesDocID: user.userData?.notesDocID,
        },
      });
      toast({ description: 'All notes restored!', className: 'bg-green-600' });
    } catch (error) {
      console.log(error);
      toast({
        description: 'Something went wrong! Try again later.',
        variant: 'destructive',
      });
    }
  };

  const deleteAll = async () => {
    try {
      await axios.delete(`${process.env.API}/api/notes/deleteall`, {
        headers: {
          notesDocID: user.userData?.notesDocID,
        },
      });
      toast({ description: 'All notes deleted!', className: 'bg-green-600' });
    } catch (error) {
      console.log(error);
      toast({
        description: 'Something went wrong! Try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section
      className={cn(
        'p-2 flex flex-col',
        deletedNotes.length == 0 && 'items-center h-full justify-center',
      )}
    >
      {deletedNotes.length != 0 && (
        <>
          <div
            className={cn(
              'flex',
              !isDesktop && 'justify-around',
              isDesktop && 'gap-2 mb-2',
            )}
          >
            <Button
              className={cn(!isDesktop && 'w-[47%]')}
              onClick={restoreAll}
            >
              Restore all
            </Button>
            <Button
              className={cn(!isDesktop && 'w-[47%]')}
              onClick={deleteAll}
              variant="destructive"
            >
              Delete All
            </Button>
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
