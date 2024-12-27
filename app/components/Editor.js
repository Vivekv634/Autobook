import { storage } from '@/firebase.config';
import { cn } from '@/lib/utils';
import AttachesTool from '@editorjs/attaches';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { EDITORJS_TOOLS } from '../utils/editorConfig';

export default function Editor({ data, readOnly = false, editorInstance }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { user } = useSelector((state) => state.note);

  useEffect(() => {
    if (!data) return;
    const editor = new EditorJS({
      tools: {
        ...EDITORJS_TOOLS,
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
      readOnly: readOnly,
      data: JSON.parse(data ?? '{}'),
      onReady: () => {
        new Undo({ editor });
        new DragDrop(editor, '2px dash #000');
        console.log('Editor is ready to work!');
      },
      autofocus: true,
      placeholder: 'Start writing your note...',
    });

    editorInstance.current = editor;
    return () => {
      if (editor) {
        if (typeof editor.destroy === 'function') {
          editor.destroy();
        } else {
          editorInstance.current = null;
        }
      }
    };
  }, [data, editorInstance, readOnly, user?.userData?.authID]);
  return (
    <div
      id="editorjs"
      className={cn(
        !isDesktop && 'mx-1 px-1',
        isDesktop && 'px-40 py-4 ',
        'border rounded-md',
      )}
    />
  );
}
