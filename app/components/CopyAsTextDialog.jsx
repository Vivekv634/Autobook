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
import { convert } from 'html-to-text';
import { Copy } from 'lucide-react';
import pretty from 'pretty';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useMediaQuery } from 'usehooks-ts';
import { useCustomToast } from './SendToast';
import { useSelector } from 'react-redux';

export default function CopyAsTextDialog({ html, open, setOpen }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const formattedHTML = pretty(html, { ocd: true });
  const Text = convert(formattedHTML);
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  function copy() {
    try {
      navigator.clipboard.writeText(Text);
      setOpen(false);
      toast({
        description: 'Text copied to clipboard!',
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {html ? (
          <div className="overflow-auto">
            <DialogHeader>
              <DialogTitle>Copy Note as Text</DialogTitle>
            </DialogHeader>
            <div className="max-h-52 my-3 overflow-auto">
              <CodeBlock text={Text} theme={dracula} />
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
                Copy Text <Copy className="h-4 w-7" />
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
