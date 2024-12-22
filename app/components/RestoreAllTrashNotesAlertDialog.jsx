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
import { useCustomToast } from "./SendToast";
import fontClassifier from "../utils/font-classifier";

export default function RestoreAllTrashNotesAlertDialog({ children }) {
  const { user } = useSelector((state) => state.note);
  const toast = useCustomToast();

  const restoreAll = async () => {
    try {
      await axios.get(`${process.env.API}/api/notes/restoreall`, {
        headers: {
          notesDocID: user?.userData?.notesDocID,
        },
      });
      toast({
        description: "All notes restored!",
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
            This operation will restore all the notes from the trash.
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={restoreAll} className="font-semibold">
            Restore all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
