import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleHelp, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generationPeriod } from '../utils/schema';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { titleFormatter } from '../utils/titleFormatter';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { uid } from 'uid';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditAutoNoteDialog = ({ notebooks, autoNote, open, setOpen }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [autoNoteName, setAutoNoteName] = useState(autoNote.autoNoteName);
  const [titleFormat, setTitleFormat] = useState(autoNote.titleFormat);
  const [showHelp, setShowHelp] = useState(false);
  const [period, setPeriod] = useState(autoNote.noteGenerationPeriod);
  const [autoNoteState] = useState(autoNote.state);
  const [loading, setLoading] = useState(false);
  const [anNotebook, setANNotebook] = useState(autoNote.autoNoteNotebookID);
  const [newNotebookFlag, setNewNotebookFlag] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookPreview, setNewNotebookPreview] = useState('');
  const [notebookNameError, setNotebookNameError] = useState(null);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.note);

  useEffect(() => {
    if (
      Object.values(notebooks)
        .map((notebook) => notebook.notebookName)
        .includes(newNotebookName.trim())
    ) {
      setNotebookNameError(
        <span>
          <span className="font-bold">{newNotebookName}</span> notebook already
          exists!
        </span>,
      );
    } else {
      setNotebookNameError(null);
    }

    setNewNotebookPreview(
      newNotebookName
        .split(' ')
        .map((word) => word.trim())
        .join(' '),
    );
  }, [setNotebookNameError, newNotebookName, notebooks]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      let autoNoteBody = {
          autoNoteName: autoNoteName,
          titleFormat: titleFormat,
          noteGenerationPeriod: period,
          state: autoNoteState,
        },
        newNotebookBody = {},
        updatedNotebooksArray = [],
        updatedNotebooks = { ...notebooks };

      if (newNotebookFlag) {
        const notebookID = uid();
        autoNoteBody['autoNoteNotebookID'] = notebookID;
        Object.keys(updatedNotebooks).forEach((notebook_id) => {
          if (notebook_id === autoNote.autoNoteNotebookID) {
            updatedNotebooks[notebook_id] = {
              ...updatedNotebooks[notebook_id],
              usedInTemplate: false,
            };
          }
          updatedNotebooksArray.push({
            notebookID: notebook_id,
            ...updatedNotebooks[notebook_id],
          });
        });
        newNotebookBody = {
          notebookID: notebookID,
          notebookName: newNotebookName,
          usedInTemplate: true,
        };
        updatedNotebooksArray.push(newNotebookBody);
      } else {
        autoNoteBody['autoNoteNotebookID'] = anNotebook;

        Object.keys(updatedNotebooks).forEach((notebook_id) => {
          if (notebook_id === autoNote.autoNoteNotebookID) {
            updatedNotebooks[notebook_id] = {
              ...updatedNotebooks[notebook_id],
              usedInTemplate: false,
            };
          }
          if (notebook_id === anNotebook) {
            updatedNotebooks[notebook_id] = {
              ...updatedNotebooks[notebook_id],
              usedInTemplate: true,
            };
          }
          updatedNotebooksArray.push({
            notebookID: notebook_id,
            ...updatedNotebooks[notebook_id],
          });
        });
      }
      await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        autoNoteBody,
        { headers: { notesDocID: user.userData.notesDocID } },
      );
      await axios.put(
        `${process.env.API}/api/notebooks/updateall`,
        updatedNotebooksArray,
        {
          headers: { notesDocID: user.userData.notesDocID },
        },
      );
      setNewNotebookName('');
      setNewNotebookFlag(false);
      setOpen(false);
      toast({
        description: (
          <span>
            <span className="font-semibold">{autoNote.autoNoteName}</span>{' '}
            updated!
          </span>
        ),
        className: 'bg-green-600',
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Auto Note</DialogTitle>
          <DialogDescription>Save changes when you are done.</DialogDescription>
        </DialogHeader>
        <div>
          <Label>Auto Note Name</Label>
          <Input
            value={autoNoteName}
            onChange={(e) => setAutoNoteName(e.target.value)}
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
            required
          />
          <Label className="text-muted-foreground">
            <div className="font-extrabold mb-1">
              Preview: {titleFormatter(titleFormat, autoNote.noteGenerated)}
            </div>
            {showHelp && (
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
            )}
          </Label>
        </div>
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
          <Label className={cn('text-red-400')}>{notebookNameError}</Label>
          <Label
            className={cn(
              (notebookNameError || newNotebookName.trim() == '') && 'hidden',
              'my-1 font-semibold',
            )}
          >
            Preview: {newNotebookPreview}
          </Label>
        </div>
        <div className="flex items-center gap-1">
          <Checkbox
            checked={newNotebookFlag}
            onCheckedChange={setNewNotebookFlag}
            id="newNotebook"
          />
          <Label htmlFor="newNotebook">Create a new Notebook</Label>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Generation period</div>
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
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'secondary' })}>
            Cancel
          </DialogClose>
          <Button
            className={cn(!isDesktop && 'my-2', 'font-semibold')}
            onClick={handleSaveChanges}
            disabled={loading || notebookNameError}
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
    </Dialog>
  );
};

export default EditAutoNoteDialog;
