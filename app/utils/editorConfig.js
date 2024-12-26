import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import NestedList from '@editorjs/list';
import Marker from '@editorjs/marker';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    shortcut: 'CTRL+SHIFT+H',
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  raw: {
    class: CodeTool,
    shortcut: 'CTRL+SHIFT+C',
    inlineToolbar: true,
  },
  inlineCode: {
    class: InlineCode,
    shortcut: 'CTRL+SHIFT+I',
    inlineToolbar: true,
  },
  list: {
    class: NestedList,
    shortcut: 'CTRL+SHIFT+L',
    inlineToolbar: true,
    config: {
      placeholder: 'Enter a list item',
      defaultType: 'unordered',
    },
  },
  underline: {
    class: Underline,
    shortcut: 'CTRL+SHIFT+U',
    inlineToolbar: true,
  },
  marker: {
    class: Marker,
    shortcut: 'CTRL+SHIFT+M',
    inlineToolbar: true,
  },
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: 'CTRL+SHIFT+W',
    config: {
      rows: 2,
      cols: 2,
      withHeadings: true,
      stretched: true,
    },
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    shortcut: 'CTRL+SHIFT+.',
    config: {
      titlePlaceholder: 'Warning Title',
      messagePlaceholder: 'Warning Message',
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: "Quote's author",
    },
  },
  delimiter: Delimiter,
};
