import { Button, buttonVariants } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CircleHelp, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { titleFormatter } from '../utils/titleFormatter';
import { useDispatch, useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { autoNote, generationPeriod, state } from '../utils/schema';
import { Separator } from '@/components/ui/separator';
import { uid } from 'uid';
import axios from 'axios';
import { setAutoNotes, setNoteBooks } from '../redux/slices/noteSlice';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const NewAutoNoteDialog = () => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [autoNoteName, setAutoNoteName] = useState('');
  const [titleFormat, setTitleFormat] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('1 day');
  const [loading, setLoading] = useState(false);
  const [autoNoteState, setAutoNoteState] = useState('running');
  const { notebooks, user } = useSelector((state) => state.note);
  const [anNotebook, setANNotebook] = useState(
    autoNote.autoNoteNotebookID ?? 'none',
  );
  const [newNotebookFlag, setNewNotebookFlag] = useState(
    Object.keys(notebooks).length == 0,
  );
  const [newNotebookName, setNewNotebookName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (Object.values(notebooks).includes(newNotebookName.trim())) {
      setError(`'${newNotebookName}' already exists!`);
    } else {
      setError(null);
    }
  }, [setError, notebooks, newNotebookName]);

  const handleCreateAutoNote = async () => {
    try {
      if (anNotebook === 'none' && !newNotebookFlag) {
        toast({ description: 'You must select a notebook first!' });
        setLoading(false);
        return;
      }
      setLoading(true);
      let newAutoNoteBody = {
        ...autoNote,
        autoNoteName: autoNoteName,
        titleFormat: titleFormat,
        state: autoNoteState,
        noteGenerationPeriod: period,
      };
      if (Object.keys(notebooks).length == 0 || newNotebookFlag) {
        const notebookID = uid();
        const newNotebookBody = {
          notebookID: notebookID,
          notebookName: newNotebookName,
          usedInTemplate: true,
        };
        newAutoNoteBody['autoNoteNotebookID'] = notebookID;
        console.log(newNotebookBody, newAutoNoteBody);
        await axios
          .post(`${process.env.API}/api/notebooks/create`, newNotebookBody, {
            headers: { notesDocID: user.userData.notesDocID },
          })
          .then((notebookResponse) => {
            console.log(notebookResponse.data.result);
            let Notebooks = {};
            notebookResponse.data.result?.map((notebook) => {
              Notebooks[notebook.notebookID] = {
                notebookName: notebook.notebookName,
                usedInTemplate: notebook.usedInTemplate,
              };
            });
            dispatch(setNoteBooks(Notebooks));
          });
      } else {
        if (notebooks[anNotebook].usedInTemplate) {
          toast({
            description: (
              <span>
                <span className="font-bold">
                  {notebooks[anNotebook].notebookName}
                </span>{' '}
                notebook is already used in another auto note.
              </span>
            ),
          });
          setLoading(false);
          return;
        }
        newAutoNoteBody['autoNoteNotebookID'] = anNotebook;
        let Notebooks = { ...notebooks };
        console.log(Notebooks, newAutoNoteBody);
        Object.keys(Notebooks).map((notebook_id) => {
          if (notebook_id === anNotebook)
            Notebooks[notebook_id].usedInTemplate = true;
        });
        let updatedNotebooks = [];
        Object.keys(Notebooks).map((notebook_id) => {
          updatedNotebooks.push({
            notebookID: notebook_id,
            ...Notebooks[notebook_id],
          });
        });
        console.log(newAutoNoteBody, updatedNotebooks);
        // await axios
        //   .put(`${process.env.API}/api/notebooks/updateall`, updatedNotebooks, {
        //     headers: { notesDocID: user.userData.notesDocID },
        //   })
        //   .then((notebookResponse) => {
        //     let notebooks = {};
        //     notebookResponse.data.result.map((notebook) => {
        //       notebooks[notebook.notebookID] = {
        //         notebookName: notebook.notebookName,
        //         usedInTemplate: notebook.usedInTemplate,
        //       };
        //     });
        //     console.log(notebooks);
        //     dispatch(setNoteBooks(notebooks));
        //   });
      }
      await axios
        .post(`${process.env.API}/api/auto-notes/create`, newAutoNoteBody, {
          headers: { notesDocID: user.userData.notesDocID },
        })
        .then((autoNoteResponse) => {
          console.log(autoNoteResponse.data.result);
          dispatch(setAutoNotes(autoNoteResponse.data.result));
        });
      setLoading(false);
      toast({
        description: 'Auto Note Created Successfully!',
        className: 'bg-green-500',
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong!',
        variant: 'destructive',
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create auto note</DialogTitle>
        <DialogDescription>Create a new auto note.</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleCreateAutoNote}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="">
          <Label htmlFor="autoNoteName">Auto Note Name</Label>
          <Input
            id="autoNoteName"
            value={autoNoteName}
            onChange={(e) => setAutoNoteName(e.target.value)}
            placeholder="Your auto note name"
            required
          />
        </div>
        <div>
          <Label htmlFor="titleFormat" className="flex gap-1">
            Title Format <CircleHelp className="h-4 w-4 cursor-pointer" />
          </Label>
          <Input
            id="titleFormat"
            className="my-2"
            value={titleFormat}
            onChange={(e) => setTitleFormat(e.target.value)}
            onFocus={() => setShowHelp(true)}
            onBlur={() => setShowHelp(false)}
            placeholder="Your title format"
            required
          />
          <Label className="text-muted-foreground">
            {showHelp && (
              <>
                <div className="font-extrabold mb-1">
                  Preview: {titleFormatter(titleFormat, 0)}
                </div>
                <div className="leading-4">
                  Available Formatters: <br />
                  #COUNT : Number of notes + 1
                  <br />
                  #TIME : Current time
                  <br />
                  #DATE : Current Date
                  <br />
                  #FULLDATE : Current full date
                  <br />
                  #DATEONLY : Current Date only
                  <br />
                </div>
              </>
            )}
          </Label>
          <div className={cn(newNotebookFlag && 'hidden')}>
            <Label>Select Notebook</Label>
            <Select
              value={anNotebook}
              onValueChange={(e) => setANNotebook(e)}
              disabled={newNotebookFlag}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="top" align="end">
                <SelectItem value="none" key="none" className="text-red-400">
                  Select Notebook
                </SelectItem>
                {Object.keys(notebooks).map((notebook_id, index) => {
                  return (
                    <SelectItem value={notebook_id} key={index}>
                      {notebooks[notebook_id].notebookName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className={cn(!newNotebookFlag && 'hidden')}>
            <Label>New Notebook Name</Label>
            <Input
              placeholder="Enter New Notebook Name..."
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              required
              disabled={!newNotebookFlag}
            />
          </div>
          <div className="flex items-center gap-1 my-2">
            <Checkbox
              checked={newNotebookFlag}
              onCheckedChange={setNewNotebookFlag}
              id="newNotebook"
              disabled={Object.keys(notebooks).length == 0}
            />
            <Label htmlFor="newNotebook">Create a new Notebook</Label>
          </div>
          <Separator />
          <div className="flex items-center justify-between my-3">
            <div className="text-lg font-semibold">generation period</div>
            <Select value={period} onValueChange={(e) => setPeriod(e)}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="top" align="end">
                {generationPeriod.map((period, index) => {
                  return (
                    <SelectItem key={index} value={period.value}>
                      {period.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between my-3">
            <div className="text-lg font-semibold">State</div>
            <Select
              value={autoNoteState}
              onValueChange={(e) => setAutoNoteState(e)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="top" align="end">
                {state.map((state, index) => {
                  return (
                    <SelectItem key={index} value={state.value}>
                      {state.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'secondary' })}>
            Cancel
          </DialogClose>
          <Button
            className={cn(!isDesktop && 'my-2', 'font-bold')}
            disabled={error != null || loading}
            onClick={handleCreateAutoNote}
            type="submit"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-[18px] animate-spin" /> Loading...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
export default NewAutoNoteDialog;
