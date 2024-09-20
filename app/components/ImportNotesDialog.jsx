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
import { useToast } from '@/components/ui/use-toast';

const acceptedFileType = ['md', 'txt', 'html'];

export default function ImportNotesDialog({ open, setOpen }) {
  const showdown = require('showdown');
  const converter = new showdown.Converter();
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { toast } = useToast();

  const importNotes = (e) => {
    e.preventDefault();
    try {
      let blocks;
      const files = Object.values(e.target[0].files);
      files.forEach((file) => {
        const fileType = file.name.split('.').slice(-1)[0];
        if (acceptedFileType.includes(fileType)) {
          const reader = new FileReader();
          reader.addEventListener('load', async (e) => {
            const result = e.target.result;
            switch (fileType) {
              case 'md': {
                let html = converter.makeHtml(result);
                blocks = htmlToEditorJs(html);
                break;
              }
              case 'html':
                blocks = htmlToEditorJs(result);
                break;
              default:
                blocks = textToEditorJs(result).blocks;
            }
            const noteBody = {
              title: file.name.split('.')[0],
              body: `{"blocks" : ${JSON.stringify(blocks)}}`,
            };
            await axios.post(`${process.env.API}/api/notes/create`, noteBody, {
              headers: { notesDocID: user.userData.notesDocID },
            });
          });
          reader.readAsText(file);
        }
      });
      toast({
        description: 'Note(s) imported successfully!',
        className: 'bg-green-600',
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
            accept=".md, .txt, .html"
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
