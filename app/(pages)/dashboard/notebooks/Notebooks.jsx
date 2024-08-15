'use client';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNoteBooks, setNotes } from '@/app/redux/slices/noteSlice';
import { Accordion } from '@/components/ui/accordion';
import { Notebook } from '@/app/components/Notebook';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import SearchDialog from '@/app/components/SearchDialog';

const NotebookComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, notebooks } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setNotesDocID(cookie.userDoc.notesDocID);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      const dataResponse = await axios.get(`${process.env.API}/api/data`, {
        headers: {
          notesDocID: notesDocID,
        },
      });
      let temp = {};
      dispatch(setNotes(dataResponse.data.result.notes));
      dataResponse.data.result.notebooks.forEach((notebook) => {
        temp[notebook.notebookID] = notebook.notebookName;
      });
      dispatch(setNoteBooks(temp));
    };
    if (notesDocID) {
      fetchData();
      console.log('fetch data from notebook page...');
    }
  }, [dispatch, notesDocID]);

  useEffect(() => {
    dispatch(setNoteBooks(notebooks));
  }, [notebooks, dispatch]);

  async function createNotebook() {
    try {
      const notebookResponse = await axios.post(
        `${process.env.API}/api/notebooks/create`,
        { notebookName: `Notebook ${Object.keys(notebooks).length + 1}` },
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      let newNotebooks = {};
      notebookResponse.data.result.map((notebook) => {
        newNotebooks[notebook.notebookID] = notebook.notebookName;
      });
      dispatch(setNoteBooks(newNotebooks));
      toast({
        description: 'New notebook created!',
        className: 'bg-green-400',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        className: 'bg-red-400',
      });
    }
  }
  return (
    <section className="p-2 flex flex-col">
      <div className="flex justify-between gap-1">
        <div
          onClick={() => {
            setCommandOpen(true);
          }}
          className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 mb-2 text-muted-foreground w-full"
        >
          <span className="ml-2">Search notebooks...</span>
        </div>
        <Button variant="secondary" onClick={createNotebook} className="p-2">
          <Plus />
        </Button>
      </div>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search your notebooks..." />
        <div className="m-3">
          <SearchDialog
            searchData={notebooks}
            noFoundPrompt="No notebooks found."
            setOpen={setCommandOpen}
          />
        </div>
      </CommandDialog>
      {notes && notebooks ? (
        <Accordion
          collapsible="true"
          type="multiple"
          className="w-full rounded-md px-2 bg-neutral-100 dark:bg-neutral-800"
          defaultValue={Object.keys(notebooks)}
        >
          {Object.keys(notebooks).length !== 0 &&
            Object.keys(notebooks).map((notebook_id) => {
              const filteredNotes = notes.filter(
                (note) => note.notebook_ref_id === notebook_id,
              );
              return (
                <Notebook
                  notebooks={notebooks}
                  notes={filteredNotes}
                  notebook_id={notebook_id}
                  key={notebook_id}
                  notesDocID={notesDocID}
                />
              );
            })}
        </Accordion>
      ) : (
        <div className="">No notebooks here.</div>
      )}
    </section>
  );
};

export default NotebookComponent;
