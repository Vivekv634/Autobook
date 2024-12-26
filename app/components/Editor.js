'use client';
import { storage } from '@/firebase.config';
import { cn } from '@/lib/utils';
import AttachesTool from '@editorjs/attaches';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import DrapDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { EDITOR_JS_TOOLS } from '../utils/editorConfig';

export default function Editor({
  editorNote,
  setEditorInstance,
  readOnly = false,
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { user } = useSelector((state) => state.note);

  useEffect(() => {
    if (!editorNote?.body) return;

    const editor = new EditorJS({
      tools: {
        ...EDITOR_JS_TOOLS,
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                try {
                  const imageRef = ref(
                    storage,
                    `${user?.userData?.authID}/${file.name}-${Date.now()}`,
                  );
                  const response = await uploadBytes(imageRef, file);
                  const URL = await getDownloadURL(response.ref);

                  return {
                    success: 1,
                    file: {
                      url: URL,
                    },
                  };
                } catch (error) {
                  console.error('File upload failed:', error);
                  return {
                    success: 0,
                    message: 'Failed to upload file.',
                  };
                }
              },
            },
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                try {
                  const imageRef = ref(
                    storage,
                    `${user?.userData?.authID}/${file.name}-${Date.now()}`,
                  );
                  const response = await uploadBytes(imageRef, file);
                  const URL = await getDownloadURL(response.ref);

                  return {
                    success: 1,
                    file: {
                      url: URL,
                    },
                  };
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return {
                    success: 0,
                    message: 'Failed to upload image.',
                  };
                }
              },
            },
          },
        },
      },
      holder: 'editorjs',
      readOnly: readOnly || editorNote?.isReadOnly,
      data: JSON.parse(editorNote?.body ?? editorNote?.template ?? '{}'),
      onReady: () => {
        new Undo({ editor });
        new DrapDrop(editor, '2px dash #000');
        console.log('Editor is ready to work!');
      },
      autofocus: true,
      placeholder: 'Start writing your note...',
    });

    setEditorInstance(editor);

    return () => {
      setEditorInstance(null);
    };
  }, [
    editorNote,
    editorNote?.body,
    editorNote?.isReadOnly,
    editorNote?.template,
    readOnly,
    setEditorInstance,
    user?.userData?.authID,
  ]);
  return (
    <div
      id="editorjs"
      className={cn(
        !isDesktop && 'mx-1 px-1',
        isDesktop && 'px-20 py-4 ',
        'border rounded-md h-max',
      )}
    />
  );
}
