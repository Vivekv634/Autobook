import { DialogContent } from "@/components/ui/dialog";
import fontClassifier from "../utils/font-classifier";
import { useSelector } from "react-redux";

export default function VerifyEmailTemplate() {
  const { user } = useSelector((state) => state.note);
  return (
    <DialogContent className={fontClassifier(user?.userData?.font)}>
      Your email is not verified. Go to your profile, click of the shield button
      next to your email address to verify your email.
    </DialogContent>
  );
}
