import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useCustomToast } from "./SendToast";
import axios from "axios";
import ButtonLoader from "./ButtonLoader";
import fontClassifier from "../utils/font-classifier";

export default function ProfileImageUpdateDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.note);
  const imageRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);

  const handleImageChange = () => {
    const file = imageRef.current.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageFile(file);
    }
  };

  const uploadProfileImage = async () => {
    try {
      setLoading(true);
      if (!imagePreview) return;
      const imageRef = ref(
        storage,
        `userProfileImage/${user?.userData?.authID}`,
      );
      await uploadBytes(imageRef, imageFile).then((response) =>
        getDownloadURL(response.ref).then(async (URL) => {
          await axios.put(
            `${process.env.API}/api/account/update/${user?.userID}`,
            { profileURL: URL },
            { headers: { notesDocID: user?.userData?.notesDocID } },
          );
        })
      );
      setLoading(false);
      setOpen(false);
      toast({
        description: "Profile image uploaded!",
        color: user?.userData?.theme,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        description: "Oops! something went wrong. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={fontClassifier(user?.userData?.font)}>
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Profile Preview"
            height={150}
            width={150}
            className="border p-1 rounded-full mx-auto aspect-square"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          ref={imageRef}
          id="uploadFile"
          className="hidden"
          onChange={handleImageChange}
        />
        <Label
          className="border rounded-md p-8 mx-auto w-fit my-3 cursor-pointer"
          htmlFor="uploadFile"
        >
          <ImageUp />
        </Label>
        <DialogFooter>
          <Button
            disabled={!imagePreview || loading}
            onClick={uploadProfileImage}
          >
            <ButtonLoader loading={loading} label="Upload file" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
