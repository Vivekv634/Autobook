'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import EditorJS from "@editorjs/editorjs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorNote } from '../redux/slices/noteSlice';
// import Header from "editorjs-header-with-alignment";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CodeBox from '@bomdi/codebox';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Marker from '@editorjs/marker';
import NestedList from '@editorjs/nested-list';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";
import Table from '@editorjs/table';
import TextVariantTune from '@editorjs/text-variant-tune';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import Strikethrough from '@sotaproject/strikethrough';
import Alert from 'editorjs-alert';
import ChangeCase from 'editorjs-change-case';
import DragDrop from 'editorjs-drag-drop';
import Paragraph from 'editorjs-paragraph-with-alignment';
import ToggleBlock from 'editorjs-toggle-block';
import Tooltip from 'editorjs-tooltip';
import Undo from 'editorjs-undo';
import { ChevronLeft, Pen, PenLine, Loading2, Loader2 } from 'lucide-react';

const NoteEditor = ({ params }) => {
  const { editorNote } = useSelector(state => state.note);
  const { noteID, notesDocID } = params;
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const editorInstance = useRef(null);
  const [noteTitle, setNoteTitle] = useState(editorNote?.title);
  const [tagsEditable, setTagsEditable] = useState(false);
  const [noteTagsInput, setNoteTagsInput] = useState(editorNote?.tagsList?.join(" "));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: true
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        tooltip: {
          class: Tooltip,
          config: {
            inlineToolbar: true,
            location: 'left',
            underline: true,
            placeholder: 'Enter a tooltip',
            highlightColor: '#FFEFD5',
            backgroundColor: '#154360',
            textColor: '#FDFEFE',
            holder: 'editorId',
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        list: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          },
        },
        strikethrough: Strikethrough,
        changeCase: {
          class: ChangeCase,
          inlineToolbar: true,
          config: {
            showLocaleOption: true,
            locale: 'tr'
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        linkTool: LinkTool,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        delimiter: Delimiter,
        warning: Warning,
        codeBox: CodeBox,
        raw: RawTool,
        underline: {
          class: Underline,
          inlineToolbar: true,
          shortcut: 'CTRL+SHIFT+U'
        },
        textVariant: TextVariantTune,
        Marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        image: SimpleImage,
        alert: {
          class: Alert,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+A',
          config: {
            alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
            defaultType: 'primary',
            messagePlaceholder: 'Enter something',
          },
        },
        toggle: {
          class: ToggleBlock,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
      },
      placeholder: 'Start writing your notes...',
      tunes: ['textVariant'],
      onReady: () => {
        new Undo({ editor });
        new DragDrop(editor);
      },
      data: editorNote?.body ? JSON.parse(editorNote.body) : {
        "blocks": [],
      }
    });

    editorInstance.current = editor;

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, [editorNote]);

  const save = () => {
    setLoading(true);
    editorInstance.current.save().then(async (outputData) => {
      const body = {
        body: JSON.stringify(outputData),
        title: noteTitle,
        tagsList: noteTagsInput.split(" ")
      }
      const response = await axios.put(`${process.env.API}/api/notes/update/${noteID}`, body, {
        headers: {
          notesDocID: notesDocID
        }
      });
      response?.data?.result?.map(note => {
        if (note.noteID == noteID) {
          dispatch(setEditorNote(note));
        }
      });
      toast({ description: 'Changes Saved!', className: 'bg-green-400' });
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      console.log('Saving failed: ', error);
    });
  };

  return (
    <section className='m-2 block box-border'>
      <div className='flex items-center mt-4 mb-1 justify-between'>
        <span onClick={() => router.back()} className='flex underline items-center'><ChevronLeft className='h-5 w-5' /> Back to notes</span>
        <Button disabled={loading} onClick={save} className=''>{loading ?
          <div className='flex items-center'><Loader2 className='h-[18px] animate-spin' /> Loading...</div> : 'Save changes'}
        </Button>
      </div>
      <Separator className='my-2' />
      <div className='flex px-1 border rounded-md pr-4 items-center mb-3'><Input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required className='bg-transparent px-1 outline-none border-none text-2xl font-semibold w-full truncate' /><Pen className='h-5 w-5' /></div>
      <div className='w-full px-2 mb-3'>
        {noteTagsInput != '' ?
          !tagsEditable && <Label className='flex flex-wrap items-center gap-1' onClick={() => setTagsEditable(true)}>
            {
              noteTagsInput && noteTagsInput.split(" ").map((tag, index) => {
                return <span key={index}>{`#${tag} `}</span>
              })
            }
            <Pen className='h-3 w-3' />
          </Label> :
          !tagsEditable && <Label onClick={() => setTagsEditable(true)} className='flex gap-1 items-center'>Add tags <PenLine className='h-3 w-3' /></Label>}
        {tagsEditable && <Input autoFocus onBlur={() => { setTagsEditable(false) }} value={noteTagsInput} onChange={e => setNoteTagsInput(e.target.value)} />}
      </div>
      <div id="editorjs" className='border rounded-md p-2 h-full'></div>
    </section>
  );
};

export default NoteEditor;
