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

const NotebookComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, notebooks } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
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
      <Button
        onClick={createNotebook}
        className="fixed right-4 bottom-4 w-[4rem] h-[4rem] rounded-full"
      >
        <Plus className="h-[2.2rem] w-[2.2rem]" />
      </Button>
      {notes && notebooks ? (
        <Accordion
          collapsible="true"
          type="multiple"
          className="w-full border rounded-md px-2"
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
