import { useMediaHook } from '@/app/utils/mediaHook';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import pretty from 'pretty';
import { CodeBlock, dracula } from 'react-code-blocks';
import fontClassifier from '../utils/font-classifier';
import { useCustomToast } from './SendToast';

export default function CopyAsHTMLDialog({
  html,
  open,
  setOpen,
  isContextOpen,
  user,
}) {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const formattedHTML = pretty(html, { ocd: true });
  const toast = useCustomToast();

  function copy() {
    try {
      navigator.clipboard.writeText(formattedHTML);
      setOpen(false);
      toast({
        description: 'HTML copied to clipboard!',
        color: user?.userData?.theme,
      });
    } catch (error) {
      setOpen(false);
      toast({
        description: 'Oops! something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  }

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
      <DialogContent className={fontClassifier(user?.userData?.font)}>
        {html ? (
          <div className="overflow-auto">
            <DialogHeader>
              <DialogTitle>Copy Note as HTML</DialogTitle>
            </DialogHeader>
            <div className="max-h-52 my-3 overflow-auto">
              <CodeBlock text={formattedHTML} language="html" theme={dracula} />
            </div>
            <DialogFooter>
              <DialogClose
                className={cn(buttonVariants({ variant: 'secondary' }))}
              >
                Close
              </DialogClose>
              <Button
                onClick={copy}
                className={cn(!isDesktop && 'my-2', 'font-semibold')}
              >
                Copy HTML <Copy className="h-4 w-7" />
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex justify-center">Note is Empty</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
