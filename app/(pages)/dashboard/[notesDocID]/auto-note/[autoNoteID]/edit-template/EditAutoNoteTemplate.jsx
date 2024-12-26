'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useCustomToast } from '@/app/components/SendToast';
import ButtonLoader from '@/app/components/ButtonLoader';
import Editor from '@/app/components/Editor';

const EditAutoNoteTemplate = ({ params }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { autoNotes, user } = useSelector((state) => state.note);
  const [editorInstance, setEditorInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoNote, setAutoNote] = useState();
  const toast = useCustomToast();

  useEffect(() => {
    autoNotes.map((autoNote) => {
      if (autoNote.autoNoteID === params.autoNoteID) {
        setAutoNote(autoNote);
      }
    });
  }, [autoNotes, params.autoNoteID]);

  const handleSave = () => {
    try {
      setLoading(true);
      editorInstance.save().then(async (outputData) => {
        const templateBody = JSON.stringify(outputData);
        await axios.put(
          `${process.env.API}/api/auto-notes/update/${params.autoNoteID}`,
          { template: templateBody },
          { headers: { notesDocID: user?.userData?.notesDocID } },
        );
      });
      setLoading(false);
      toast({
        description: (
          <span>
            <span className="font-bold">{autoNote.autoNoteName}</span> updated!
          </span>
        ),
        color: user?.userData?.theme,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="h-full box-border">
      <ScrollArea>
        <div
          className={cn(
            'flex justify-between items-center',
            !isDesktop && 'mt-4 mb-1 mx-1',
          )}
        >
          <span className="text-2xl font-semibold">
            {autoNote?.autoNoteName}
          </span>
          <Button
            disabled={loading}
            className="disabled:cursor-not-allowed font-semibold"
            onClick={handleSave}
          >
            <ButtonLoader loading={loading} label="Save changes" />
          </Button>
        </div>
        <Separator className="my-2" />
        <Editor editorNote={autoNote} setEditorInstance={setEditorInstance} />
        <ScrollBar />
      </ScrollArea>
    </section>
  );
};

export default EditAutoNoteTemplate;
