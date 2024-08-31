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

const NewAutoNoteDialog = () => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [autoNoteName, setAutoNoteName] = useState('');
  const [titleFormat, setTitleFormat] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [notebookName, setNotebookName] = useState('');
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('1 day');
  const [loading, setLoading] = useState(false);
  const [autoNoteState, setAutoNoteState] = useState('running');
  const { notebooks, user } = useSelector((state) => state.note);
  const { toast } = useToast();

  useEffect(() => {
    if (Object.values(notebooks).includes(notebookName.trim())) {
      setError(`'${notebookName}' already exists!`);
    } else {
      setError(null);
    }
  }, [setError, notebooks, notebookName]);

  const handleCreateAutoNote = async () => {
    try {
      setLoading(true);
      const notebookID = uid();
      const notebooks = {
        notebookID: notebookID,
        notebookName: notebookName,
        usedInTemplate: true,
      };
      const autoNotes = {
        ...autoNote,
        autoNoteName: autoNoteName,
        autoNoteNotebookID: notebookID,
        noteGenerationPeriod: period,
        state: autoNoteState,
        titleFormat: titleFormat,
      };
      const dataResponse = await axios.put(
        `${process.env.API}/api/data/update`,
        { autoNotes, notebooks },
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      let temp = {};
      dataResponse.data.result.notebooks.map((notebook) => {
        temp[notebook.notebookID] = notebook.notebookName;
      });
      dispatch(setNoteBooks(temp));
      dispatch(setAutoNotes(dataResponse.data.result.autoNotes));
      toast({
        description: 'New Auto Note created!',
        className: 'bg-green-400',
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again!',
        className: 'bg-red-400',
      });
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create auto note</DialogTitle>
        <DialogDescription>Create a new auto note.</DialogDescription>
      </DialogHeader>
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
        <div className="">
          <Label htmlFor="notebookName">New Notebook Name</Label>
          <Input
            id="notebookName"
            value={notebookName}
            onChange={(e) => setNotebookName(e.target.value)}
            placeholder="Create a new notebook"
            required
          />
          {error && <Label className="text-red-400">{error}</Label>}
        </div>
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
          disabled={error != null && loading}
          onClick={handleCreateAutoNote}
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
    </DialogContent>
  );
};
export default NewAutoNoteDialog;
