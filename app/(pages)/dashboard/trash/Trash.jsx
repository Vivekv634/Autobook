'use client';
import Note from '@/app/components/Note';
import { removeDeletedNotes, setNotes } from '@/app/redux/slices/noteSlice';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';

const TrashComponent = () => {
  const { deletedNotes, user, notebooks } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const restoreAll = async () => {
    try {
      const restoreResponse = await axios.get(
        `${process.env.API}/api/notes/restoreall`,
        {
          headers: {
            notesDocID: user.userData?.notesDocID,
          },
        },
      );
      dispatch(setNotes(restoreResponse.data.result));
      dispatch(removeDeletedNotes([]));
      toast({ description: 'All notes restored!' });
    } catch (error) {
      console.log(error);
      toast({ description: 'Something went wrong! Try again later.' });
    }
  };

  const deleteAll = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.API}/api/notes/deleteall`,
        {
          headers: {
            notesDocID: user.userData?.notesDocID,
          },
        },
      );
      dispatch(setNotes(deleteResponse.data.result));
      dispatch(removeDeletedNotes());
      toast({ description: deleteResponse.data.result });
    } catch (error) {
      console.log(error);
      toast({ description: 'Something went wrong! Try again later.' });
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
        <div
          className={cn(
            'flex',
            !isDesktop && 'justify-around',
            isDesktop && 'gap-2 mb-2',
          )}
        >
          <Button className={cn(!isDesktop && 'w-[47%]')} onClick={restoreAll}>
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
      )}
      {deletedNotes.length != 0 &&
        deletedNotes.map((note, index) => {
          return (
            <Note
              key={index}
              note={note}
              notesDocID={user.userData.notesDocID}
              notebook_name={notebooks[note.notebook_ref_id]?.notebookName}
            />
          );
        })}
      {deletedNotes.length == 0 && (
        <div className="flex items-center justify-between h-full text-3xl">
          Empty bin!
        </div>
      )}
    </section>
  );
};

export default TrashComponent;
