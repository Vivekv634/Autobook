import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import textToEditorJs from '../utils/textToEditorJs';
import htmlToEditorJs from '../utils/htmlToEditor';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { acceptedFileType } from '../utils/schema';
import { useCustomToast } from './SendToast';

export default function ImportNotesDialog({ open, setOpen }) {
  const showdown = require('showdown');
  const converter = new showdown.Converter();
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const toast = useCustomToast();

  const importNotes = (e) => {
    e.preventDefault();
    try {
      let blocks;
      const files = Object.values(e.target[0].files);
      files.forEach((file) => {
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
            const noteBody = {
              title: file.name.split('.')[0],
              body: `{"blocks" : ${JSON.stringify(blocks)}}`,
            };
            await axios.post(`${process.env.API}/api/notes/create`, noteBody, {
              headers: { notesDocID: user?.userData?.notesDocID },
            });
          });
          reader.readAsText(file);
        }
      });
      toast({
        description: 'Note(s) imported successfully!',
        color: user?.userData?.theme,
      });
      setOpen(false);
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
          <DialogTitle>Import Notes</DialogTitle>
        </DialogHeader>
        <form onSubmit={importNotes}>
          <Input
            type="file"
            multiple
            required
            accept=".md, .txt, .html, .json"
            className="my-2"
          />
          <DialogFooter>
            <DialogClose
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Cancel
            </DialogClose>
            <Button
              className={cn(!isDesktop && 'my-2', 'font-semibold')}
              type="submit"
            >
              Import
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
