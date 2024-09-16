export default function textToEditorJs(text) {
  return {
    blocks: text.split('\n').map((line) => ({
      type: 'paragraph',
      data: {
        text: line,
      },
    })),
  };
}
