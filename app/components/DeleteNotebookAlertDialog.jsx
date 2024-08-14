import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setNoteBooks } from '../redux/slices/noteSlice';
import { useToast } from '@/components/ui/use-toast';

export default function DeleteNotebookAlertDialog({
  children,
  notebook_id,
  notesDocID,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  async function handleDelete() {
    try {
      const deleteNotebookResponse = await axios.delete(
        `${process.env.API}/api/notebooks/delete/${notebook_id}`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      let notebooks = {};
      deleteNotebookResponse.data.result.map((notebook) => {
        notebooks[notebook.notebookID] = notebook.notebookname;
      });
      dispatch(setNoteBooks(notebooks));
      toast({ description: 'Notebook deleted!', className: 'bg-green-400' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        className: 'bg-red-400',
      });
    }
  }

  return (
    <AlertDialog onClick={(e) => e.stopPropagation()}>
      <AlertDialogTrigger
        className="text-red-400 flex justify-between w-44 pr-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            notebook, but doesn&apos;t delete your notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
