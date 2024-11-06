'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import EditorJS from '@editorjs/editorjs';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { editorConfig } from '@/app/utils/editorConfig';
import axios from 'axios';
import { useCustomToast } from '@/app/components/SendToast';
import hotkeys from 'hotkeys-js';
import ButtonLoader from '@/app/components/ButtonLoader';

const EditAutoNoteTemplate = ({ params }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { autoNotes, user } = useSelector((state) => state.note);
  const [data, setData] = useState();
  const editorInstance = useRef(null);
  const [loading, setLoading] = useState(false);
  const [autoNote, setAutoNote] = useState();
  const toast = useCustomToast();

  hotkeys('ctrl+s, command+m', (e) => {
    e.preventDefault();
    handleSave();
  });

  useEffect(() => {
    autoNotes.map((autoNote) => {
      if (autoNote.autoNoteID === params.autoNoteID) {
        setAutoNote(autoNote);
        setData(autoNote?.template ?? '{}');
      }
    });
  }, [autoNotes, params.autoNoteID]);

  useEffect(() => {
    if (!data) return;

    const editor = new EditorJS({
      ...editorConfig,
      data: data ? JSON.parse(data) : '{}',
    });

    editorInstance.current = editor;

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === 'function'
      ) {
        editorInstance.current.destroy();
      }
      editorInstance.current = null;
    };
  }, [data]);

  const handleSave = () => {
    try {
      setLoading(true);
      editorInstance.current.save().then(async (outputData) => {
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
            'flex justify-between items-center print:hidden',
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
        <div
          id="editorjs"
          className={cn(
            !isDesktop && 'px-1 mx-1',
            isDesktop && 'px-20 py-4 ',
            'border rounded-md',
          )}
        ></div>
        <ScrollBar />
      </ScrollArea>
    </section>
  );
};

export default EditAutoNoteTemplate;
