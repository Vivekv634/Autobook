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
import { Printer } from 'lucide-react';
import pretty from 'pretty';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useMediaQuery } from 'usehooks-ts';
import { useCustomToast } from './SendToast';

export default function NotePrintDialog({ html, open, setOpen }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const formattedHTML = pretty(html, { ocd: true });
  const toast = useCustomToast();

  function printHTML() {
    try {
      const printableContent = formattedHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(printableContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
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
              <DialogTitle>Print Note</DialogTitle>
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
                onClick={printHTML}
                className={cn(!isDesktop && 'my-2', 'font-semibold')}
              >
                Print it <Printer className="h-4 w-7" />
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
