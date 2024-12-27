import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import EditorjsList from '@editorjs/list';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import Strikethrough from '@sotaproject/strikethrough';
import Paragraph from '@editorjs/paragraph';

export let EDITORJS_TOOLS = {
  header: {
    class: Header,
    shortcut: 'CMD+SHIFT+H',
    config: {
      inlineToolbar: true,
      placeholder: 'Heading',
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 1,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    shortcut: 'CMD+SHIFT+O',
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: "Quote's author",
    },
  },
  list: {
    class: EditorjsList,
    shortcut: 'CMD+SHIFT+L',
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  strikethrough: Strikethrough,
  table: {
    class: Table,
    shortcut: 'CMD+ALT+T',
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  delimiter: Delimiter,
  warning: {
    class: Warning,
    shortcut: 'CMD+SHIFT+W',
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Warning Title',
      messagePlaceholder: 'Warning Message',
    },
  },
  raw: {
    class: RawTool,
    shortcut: 'CMD+SHIFT+D',
    placeholder: "print('Hello world!')",
  },
  underline: {
    class: Underline,
    shortcut: 'CMD+U',
    inlineToolbar: true,
  },
  inlineCode: {
    class: InlineCode,
    config: {
      inlineToolbar: true,
    },
    shortcut: 'CMD+SHIFT+M',
  },
};
