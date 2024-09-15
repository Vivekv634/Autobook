'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import JSZip from 'jszip';
import editorJsToHtml from '../utils/editorJSToHTML';
import pretty from 'pretty';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { convert } from 'html-to-text';
import { useToast } from '@/components/ui/use-toast';
import { saveAs } from 'file-saver';
import { exportType } from '../utils/schema';

export default function ExportNotebookDialog({
  notes,
  notebook_id,
  open,
  setOpen,
}) {
  const { notebooks } = useSelector((state) => state.note);
  const zip = new JSZip();
  const notebookFolder = zip.folder(notebooks[notebook_id].notebookName);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [exporttype, setExportType] = useState('html');
  const { toast } = useToast();
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

  const handleExportNotebook = () => {
    try {
      notes?.map((note) => {
        let fileName = `${note.title}.${exporttype}`;
        notebookFolder.file(fileName, fileData(note, exporttype));
      });
      zip
        .generateAsync({ type: 'blob' })
        .then((blob) =>
          saveAs(blob, `${notebooks[notebook_id].notebookName}.zip`),
        );
      toast({ description: 'Notebook Exported!', className: 'bg-green-600' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Notebook</DialogTitle>
        </DialogHeader>
        {notes.length ? (
          <>
            <div>
              <Label htmlFor="exportNotebook">Export Notebook as</Label>
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
            </div>
            <DialogFooter>
              <DialogClose
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: 'secondary' }))}
              >
                Cancel
              </DialogClose>
              <Button
                onClick={handleExportNotebook}
                className={cn(!isDesktop && 'my-2', 'font-semibold')}
              >
                Export
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div>
              {notebooks[notebook_id].notebookName} notebook doesn&apos;t
              contains any note.
            </div>
            <Button
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Close
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
