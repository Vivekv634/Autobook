import { Button, buttonVariants } from '@/components/ui/button';
import htmlToEditorJs from '../utils/htmlToEditor';
import { useSelector } from 'react-redux';
import { acceptedFileType } from '../utils/schema';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CircleHelp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMediaHook } from '@/app/utils/mediaHook';
import { titleFormatter } from '../utils/titleFormatter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { autoNote, generationPeriod, state } from '../utils/schema';
import { Separator } from '@/components/ui/separator';
import { v4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';
import { auth } from '@/firebase.config';
import VerifyEmailTemplate from './VerifyEmailTemplate';
import Showdown from 'showdown';
import axios from 'axios';
import textToEditorJs from '../utils/textToEditorJs';
import { useCustomToast } from './SendToast';
import ButtonLoader from './ButtonLoader';

const NewAutoNoteDialog = ({ setOpen }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [autoNoteName, setAutoNoteName] = useState('');
  const [titleFormat, setTitleFormat] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('1 day');
  const [loading, setLoading] = useState(false);
  const [autoNoteState, setAutoNoteState] = useState('running');
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const [selectedtemplateNote, setSelectedTemplateNote] = useState('none');
  const [templateNotes] = useState(notes ?? []);
  const [anNotebook, setANNotebook] = useState(
    autoNote.autoNoteNotebookID ?? 'none',
  );
  const [newNotebookFlag, setNewNotebookFlag] = useState(true);
  const [templateFromDevice, setTemplateFromDevice] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [notebookNameError, setNotebookNameError] = useState(null);
  const [notebookNamePreview, setNotebookNamePreview] = useState(null);
  const toast = useCustomToast();
  const converter = new Showdown.Converter();

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

    setNotebookNamePreview(
      newNotebookName
        .split(' ')
        .map((word) => word.trim())
        .join(' '),
    );
  }, [setNotebookNameError, newNotebookName, notebooks]);

  useEffect(() => {
    if (Object.values(notebooks).includes(newNotebookName.trim())) {
      setError(`'${newNotebookName}' already exists!`);
    } else {
      setError(null);
    }
  }, [setError, notebooks, newNotebookName]);

  const handleCreateAutoNote = async (e) => {
    e.preventDefault();
    try {
      if (anNotebook === 'none' && !newNotebookFlag) {
        toast({
          description: 'You must select a notebook first!',
          color: user?.userData?.theme,
        });
        setLoading(false);
        return;
      }
      if (newNotebookName == '' && newNotebookFlag) {
        toast({
          description: 'Create a new notebook first!',
          color: user?.userData?.theme,
        });
        setLoading(true);
        return;
      }
      setLoading(true);
      let newAutoNoteBody = {
          ...autoNote,
          autoNoteID: v4(),
          autoNoteName: autoNoteName,
          titleFormat: titleFormat,
          state: autoNoteState,
          noteGenerationPeriod: period,
        },
        newNotebookBody = {},
        updatedNotebookArray = [],
        updatedNotebooks = { ...notebooks };
      if (Object.keys(notebooks).length == 0 || newNotebookFlag) {
        const notebookID = v4();
        newAutoNoteBody['autoNoteNotebookID'] = notebookID;
        newNotebookBody = {
          notebookID: notebookID,
          notebookName: newNotebookName
            .split(' ')
            .filter((word) => word !== '')
            .join(' '),
          usedInTemplate: true,
        };
        Object.keys(updatedNotebooks).forEach((notebook_id) => {
          updatedNotebookArray.push({
            notebookID: notebook_id,
            ...updatedNotebooks[notebook_id],
          });
        });
        updatedNotebookArray.push(newNotebookBody);
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
        Object.keys(updatedNotebooks).map((notebook_id) => {
          if (notebook_id === anNotebook)
            updatedNotebooks[notebook_id] = {
              ...updatedNotebooks[notebook_id],
              usedInTemplate: true,
            };

          updatedNotebookArray.push({
            notebookID: notebook_id,
            ...updatedNotebooks[notebook_id],
          });
        });
      }
      if (templateFromDevice && e.target[9].files[0]) {
        let blocks;
        const file = e.target[9].files[0];
        const fileType = file.type;
        if (acceptedFileType.includes(fileType)) {
          const reader = new FileReader();
          reader.addEventListener('load', async (e) => {
            const fileData = e.target.result;
            switch (fileType) {
              case 'text/markdown': {
                let html = converter.makeHtml(fileData);
                blocks = htmlToEditorJs(html);
                break;
              }
              case 'text/html':
                blocks = htmlToEditorJs(fileData);
                break;
              case 'application/json':
                blocks = JSON.parse(fileData);
                break;
              case 'text/plain':
                blocks = textToEditorJs(fileData).blocks;
                break;
              default:
                throw new Error('Invalid file type!');
            }
            newAutoNoteBody['template'] = JSON.stringify(blocks);
          });
          reader.readAsText(file);
        }
      } else if (!templateFromDevice && selectedtemplateNote != 'none') {
        const selectedNote = notes?.filter(
          (note) => note.noteID === selectedtemplateNote,
        );
        newAutoNoteBody['template'] = selectedNote[0].body;
      }
      await axios.post(
        `${process.env.API}/api/auto-notes/create`,
        newAutoNoteBody,
        {
          headers: { notesDocID: user?.userData?.notesDocID },
        },
      );
      await axios.put(
        `${process.env.API}/api/notebooks/updateall`,
        updatedNotebookArray,
        { headers: { notesDocID: user?.userData?.notesDocID } },
      );
      setLoading(false);
      setNewNotebookName('');
      setAutoNoteName('');
      setTitleFormat('');
      setPeriod('1 day');
      setOpen((open) => !open);
      setAutoNoteState('running');
      toast({
        description: 'Auto Note Created Successfully!',
        color: user?.userData?.theme,
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

  if (!auth.currentUser?.emailVerified) return <VerifyEmailTemplate />;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create auto note</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => handleCreateAutoNote(e)}>
        <div className="my-2">
          <Label htmlFor="autoNoteName" className="font-semibold">
            Auto Note Name
            <span className="text-muted-foreground text-[.8rem]">
              (Required)
            </span>
          </Label>
          <Input
            id="autoNoteName"
            value={autoNoteName}
            onChange={(e) => setAutoNoteName(e.target.value)}
            placeholder="Your auto note name"
            required
          />
        </div>
        <div>
          <Label
            htmlFor="titleFormat"
            className="flex items-center gap-1 font-semibold text-center"
          >
            Title Format <CircleHelp className="h-4 w-4 cursor-pointer" />
            <span className="text-muted-foreground text-[.8rem]">
              (Required)
            </span>
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
            <Label className="font-semibold">
              Select Notebook
              <span className="text-muted-foreground text-[.8rem]">
                (Required)
              </span>
            </Label>
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
            <Label className="font-semibold">
              New Notebook Name
              <span className="text-muted-foreground text-[.8rem]">
                (Required)
              </span>
            </Label>
            <Input
              placeholder="Enter New Notebook Name..."
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              required={newNotebookFlag}
              disabled={!newNotebookFlag}
            />
            <Label className={cn('text-red-400')}>{notebookNameError}</Label>
            <Label
              className={cn(
                (notebookNameError || newNotebookName.trim() == '') && 'hidden',
                'my-1 font-semibold',
              )}
            >
              Preview: {notebookNamePreview}
            </Label>
          </div>
          <div className="flex items-center gap-1 my-2">
            <Checkbox
              checked={newNotebookFlag}
              onCheckedChange={setNewNotebookFlag}
              id="newNotebook"
            />
            <Label htmlFor="newNotebook">Create a new Notebook</Label>
          </div>
          <div className={cn(templateFromDevice && 'hidden')}>
            <Label className="font-semibold">Select Template from notes</Label>
            <Select
              value={selectedtemplateNote}
              onValueChange={(e) => setSelectedTemplateNote(e)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="top" align="end">
                <SelectItem value="none" key="none" className="text-red-400">
                  None
                </SelectItem>
                {templateNotes?.map((note, index) => {
                  return (
                    <SelectItem value={note.noteID} key={index}>
                      {note.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className={cn(!templateFromDevice && 'hidden')}>
            <Label className="font-semibold">Select Template from Device</Label>
            <Input
              type="file"
              required
              accept=".md, .txt, .html, .json"
              className="my-2"
              disabled={!templateFromDevice}
            />
          </div>
          <div className="flex items-center gap-1 my-2">
            <Checkbox
              checked={templateFromDevice}
              onCheckedChange={setTemplateFromDevice}
              id="templateFromDevice"
            />
            <Label htmlFor="templateFromDevice">Select from device</Label>
          </div>
          <Separator />
          <div className="flex items-center justify-between my-3">
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
            className={cn(!isDesktop && 'my-2', 'font-semibold')}
            disabled={error != null || loading || notebookNameError}
            type="submit"
          >
            <ButtonLoader loading={loading} label="Save Changes" />
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
export default NewAutoNoteDialog;
