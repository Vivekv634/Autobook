import React, { useState } from 'react';
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
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAutoNotes } from '../redux/slices/noteSlice';
import { useToast } from '@/components/ui/use-toast';
import { titleFormatter } from '../utils/titleFormatter';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Separator } from '@/components/ui/separator';

const EditAutoNoteDialog = ({ autoNote, open, setOpen }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [autoNoteName, setAutoNoteName] = useState(autoNote.autoNoteName);
  const [titleFormat, setTitleFormat] = useState(autoNote.titleFormat);
  const [showHelp, setShowHelp] = useState(false);
  const [period, setPeriod] = useState(autoNote.noteGenerationPeriod);
  const [autoNoteState] = useState(autoNote.state);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const body = {
        autoNoteName: autoNoteName,
        titleFormat: titleFormat,
        noteGenerationPeriod: period,
        state: autoNoteState,
      };
      const updateResponse = await axios.put(
        `${process.env.API}/api/auto-notes/update/${autoNote.autoNoteID}`,
        body,
        {
          headers: {
            notesDocID: user.userData.notesDocID,
          },
        },
      );
      dispatch(setAutoNotes(updateResponse.data.result));
      setLoading(false);
      toast({ description: 'Auto Note updated!', className: 'bg-green-400' });
      setOpen(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again!',
        className: 'bg-red-400',
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
        <Separator />
        <div className="flex items-center justify-between">
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
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'secondary' })}>
            Cancel
          </DialogClose>
          <Button
            className={cn(!isDesktop && 'my-2')}
            onClick={handleSaveChanges}
            disabled={loading}
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
