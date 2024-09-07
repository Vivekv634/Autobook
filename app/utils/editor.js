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
import Table from '@editorjs/table';
import TextVariantTune from '@editorjs/text-variant-tune';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import Strikethrough from '@sotaproject/strikethrough';
import Alert from 'editorjs-alert';
import ChangeCase from 'editorjs-change-case';
import Paragraph from 'editorjs-paragraph-with-alignment';
import ToggleBlock from 'editorjs-toggle-block';
import Tooltip from 'editorjs-tooltip';

export let editorConfig = {
  holder: 'editorjs',
  tools: {
    header: {
      class: Header,
      config: {
        placeholder: 'Heading 1',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 1,
      },
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
        holder: 'editorjs',
      },
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+O',
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: "Quote's author",
      },
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
        locale: 'tr',
      },
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
    raw: RawTool,
    underline: {
      class: Underline,
      inlineToolbar: true,
      shortcut: 'CTRL+SHIFT+U',
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
    alert: {
      class: Alert,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+A',
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
          coub: true,
        },
      },
    },
  },
  placeholder: 'Start writing your notes...',
  tunes: ['textVariant'],
};
