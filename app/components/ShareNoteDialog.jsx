import { Button, buttonVariants } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { Copy, ExternalLink } from 'lucide-react';
import fontClassifier from '../utils/font-classifier';

export default function ShareNoteDialog({
  open,
  setOpen,
  notesDocID,
  noteID,
  isContextOpen,
  user,
}) {
  const link = `${process.env.API}/share/${notesDocID}/${noteID}`;
  const copyHandler = () => {
    navigator.clipboard.writeText(link);
  };
  return (
    <Dialog
      open={open && !isContextOpen}
      onOpenChange={(open) => {
        setOpen(open);
        setTimeout(() => {
          if (!open) {
            document.body.style.pointerEvents = '';
          }
        }, 100);
      }}
    >
      <DialogContent className={fontClassifier(user.userData.font)}>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex gap-1">
          <Input value={link} readonly className="mr-2" />
          <Button onClick={copyHandler} size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="flex gap-1">
          <DialogClose className={cn(buttonVariants({ variant: 'secondary' }))}>
            Close
          </DialogClose>
          <Button onClick={() => window.open(link)} className="font-semibold">
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
