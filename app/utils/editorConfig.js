import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Title from 'title-editorjs';
import InlineCode from '@editorjs/inline-code';
import NestedList from '@editorjs/nested-list';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import ToggleBlock from 'editorjs-toggle-block';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import Strikethrough from '@sotaproject/strikethrough';
import Alert from 'editorjs-alert';
import ChangeCase from 'editorjs-change-case';
import Paragraph from 'editorjs-paragraph-with-alignment';

export let editorConfig = {
  holder: 'editorjs',
  tools: {
    title: Title,
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: "Quote's author",
      },
    },
    toggle: {
      class: ToggleBlock,
      inlineToolbar: true,
    },
    list: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    strikethrough: Strikethrough,
    changeCase: {
      class: ChangeCase,
      inlineToolbar: true,
      config: {
        showLocaleOption: true,
        locale: ['tr', 'TR', 'tr-TR'],
      },
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    delimiter: Delimiter,
    warning: {
      class: Warning,
      inlineToolbar: true,
      config: {
        titlePlaceholder: 'Warning Title',
        messagePlaceholder: 'Warning Message',
      },
    },
    raw: {
      class: RawTool,
      placeholder: "print('Hello world!')",
    },
    underline: {
      class: Underline,
      inlineToolbar: true,
    },
    inlineCode: {
      class: InlineCode,
    },
    alert: {
      class: Alert,
      inlineToolbar: true,
      config: {
        alertTypes: [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'light',
          'dark',
        ],
        defaultType: 'primary',
        messagePlaceholder: 'Your alert',
      },
    },
    embed: {
      class: Embed,
      inlineToolbar: true,
      config: {
        services: {
          youtube: true,
          coub: true,
        },
      },
    },
  },
  placeholder: 'Start writing your notes...',
  tunes: ['textVariant'],
};
