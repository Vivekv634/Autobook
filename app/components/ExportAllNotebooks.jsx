import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { exportType } from '../utils/schema';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import JSZip from 'jszip';
import { useSelector } from 'react-redux';
import editorJsToHtml from '../utils/editorJSToHTML';
import pretty from 'pretty';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { convert } from 'html-to-text';
import { useMediaQuery } from 'usehooks-ts';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';

export default function ExportAllNotebooks({ open, setOpen }) {
  const [exporttype, setExportType] = useState('html');
  const { user, notes, notebooks } = useSelector((state) => state.note);
  const { toast } = useToast();
  const zip = new JSZip();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const turndownServices = new TurndownService();
  turndownServices.use(gfm);

  function fileData(data, fileType) {
    const html = editorJsToHtml(JSON.parse(data.body).blocks);
    const formattedHTML = pretty(html, { ocd: true });
    switch (fileType) {
      case 'md':
        return turndownServices.turndown(formattedHTML);
      case 'txt':
        return convert(formattedHTML);
      default:
        return formattedHTML;
    }
  }

  const exportAllNotebooks = () => {
    try {
      Object.keys(notebooks).forEach((notebook_id) => {
        const notebookFolder = zip.folder(notebooks[notebook_id].notebookName);
        const filteredNotes = notes?.filter(
          (note) => note.notebook_ref_id === notebook_id,
        );
        filteredNotes.forEach((note) => {
          let fileName = `${note.title}.${exporttype}`;
          notebookFolder.file(fileName, fileData(note, exporttype));
        });
      });
      zip
        .generateAsync({ type: 'blob' })
        .then((blob) => saveAs(blob, `${user.userData.name}.zip`));
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Notebooks</DialogTitle>
        </DialogHeader>
        <Select value={exporttype} onValueChange={setExportType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" side="top" align="end">
            {exportType.map((type, index) => {
              return (
                <SelectItem key={index} value={type.val}>
                  {type.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Cancel
          </DialogClose>
          <Button
            onClick={exportAllNotebooks}
            className={cn(!isDesktop && 'my-2', 'font-semibold')}
          >
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}