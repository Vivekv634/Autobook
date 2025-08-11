"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { NoteType } from "@/types/Note.type";
import ButtonLoader from "../ButtonLoader";
import { exportBlockNoteToPDF } from "@/lib/blockToPDF";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Loader } from "lucide-react";

interface Props {
  note: NoteType;
  openPrintDialog: string | null;
  setOpenPrintDialogAction(value: string | null): void;
}

export default function NotePrintDialog({
  openPrintDialog,
  setOpenPrintDialogAction,
  note,
}: Props) {
  const [pdfInstance, setPdfInstance] = useState<jsPDF | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!note?.body) return;
    setLoading(true);

    exportBlockNoteToPDF(JSON.parse(note.body))
      .then((pdf) => {
        setPdfInstance(pdf);

        // Create Blob URL for preview
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [note]);

  const handleDownload = () => {
    if (pdfInstance) {
      pdfInstance.save(`${note.title || "note"}.pdf`);
    }
  };

  return (
    <Dialog
      open={openPrintDialog === note.note_id}
      onOpenChange={(open) => {
        if (!open) setOpenPrintDialogAction(null);
      }}
    >
      <DialogContent className="max-h-[65vh] w-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Print Note</DialogTitle>
          <DialogDescription>
            Preview and download your note as PDF
          </DialogDescription>
        </DialogHeader>

        {/* PDF Preview */}
        <div className="flex-1 h-full rounded overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center text-muted-foreground">
              <Loader className="animate-spin" />
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              style={{ border: "none" }}
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4">
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            Cancel
          </DialogClose>
          <ButtonLoader
            className="font-semibold"
            loading={loading}
            disabled={loading || !pdfInstance}
            label="Download"
            onClick={handleDownload}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
