"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMediaHook } from "@/app/utils/mediaHook";
import JSZip from "jszip";
import editorJsToHtml from "../utils/editorJSToHTML";
import pretty from "pretty";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { convert } from "html-to-text";
import { saveAs } from "file-saver";
import { exportType } from "../utils/schema";
import { useCustomToast } from "./SendToast";
import fontClassifier from "../utils/font-classifier";

export default function ExportNotebookDialog({
  notes,
  notebook_id,
  open,
  setOpen,
  isDropDownMenuOpen,
}) {
  const { user, notebooks } = useSelector((state) => state.note);
  const zip = new JSZip();
  const notebookFolder = zip.folder(notebooks[notebook_id].notebookName);
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [exporttype, setExportType] = useState("html");
  const toast = useCustomToast();
  const turndownServices = new TurndownService();
  turndownServices.use(gfm);

  function fileData(data, fileType) {
    const jsonData = JSON.parse(data.body).blocks;
    const html = editorJsToHtml(jsonData);
    const formattedHTML = pretty(html, { ocd: true });
    switch (fileType) {
      case "md":
        return turndownServices.turndown(formattedHTML);
      case "txt":
        return convert(formattedHTML);
      case "json":
        return JSON.stringify(jsonData);
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
        .generateAsync({ type: "blob" })
        .then((blob) =>
          saveAs(blob, `${notebooks[notebook_id].notebookName}.zip`)
        );
      toast({
        description: "Notebook Exported!",
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "Oops! something went wrong. Try again later!",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open && !isDropDownMenuOpen}
      onOpenChange={(open) => {
        setOpen(open);
        setTimeout(() => {
          if (!open) {
            document.body.style.pointerEvents = "";
          }
        }, 100);
      }}
    >
      <DialogContent className={fontClassifier(user?.userData?.font)}>
        <DialogHeader>
          <DialogTitle>Export Notebook</DialogTitle>
        </DialogHeader>
        {notes.length
          ? (
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
                  className={cn(buttonVariants({ variant: "secondary" }))}
                >
                  Cancel
                </DialogClose>
                <Button
                  onClick={handleExportNotebook}
                  className={cn(!isDesktop && "my-2", "font-semibold")}
                >
                  Export
                </Button>
              </DialogFooter>
            </>
          )
          : (
            <>
              <div>
                {notebooks[notebook_id].notebookName}{" "}
                notebook doesn&apos;t contains any note.
              </div>
              <Button
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Close
              </Button>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
}
