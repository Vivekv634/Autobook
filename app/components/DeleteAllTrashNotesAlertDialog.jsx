import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCustomToast } from "./SendToast";
import fontClassifier from "../utils/font-classifier";

export default function DeleteAllTrashNotesAlertDialog({ children }) {
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  const deleteAll = async () => {
    try {
      await axios.delete(`${process.env.API}/api/notes/deleteall`, {
        headers: {
          notesDocID: user?.userData?.notesDocID,
        },
      });
      toast({
        description: "All notes deleted!",
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "Something went wrong! Try again later.",
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog onClick={(e) => e.stopPropagation()}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className={fontClassifier(user?.userData?.font)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <div className="text-muted-foreground">
            This operation cannot be reverse. This will permanently delete all
            the notes in the trash.
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAll}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
