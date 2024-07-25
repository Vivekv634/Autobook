const customBindings = {
    // Bold: Ctrl + B
    bold: {
        key: 'B',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('bold', !context.format.bold);
        }
    },
    // Italic: Ctrl + I
    italic: {
        key: 'I',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('italic', !context.format.italic);
        }
    },
    // Underline: Ctrl + U
    underline: {
        key: 'U',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('underline', !context.format.underline);
        }
    },
    // Strike: Ctrl + Shift + X
    strike: {
        key: 'X',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('strike', !context.format.strike);
        }
    },
    // Header 1: Ctrl + Shift + 1
    header1: {
        key: '1',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('header', context.format.header === 1 ? false : 1);
        }
    },
    // Header 2: Ctrl + Shift + 2
    header2: {
        key: '2',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('header', context.format.header === 2 ? false : 2);
        }
    },
    // Blockquote: Ctrl + Shift + Q
    blockquote: {
        key: 'Q',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('blockquote', !context.format.blockquote);
        }
    },
    // Code Block: Ctrl + Shift + C
    codeBlock: {
        key: 'C',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('code-block', !context.format['code-block']);
        }
    },
    // List (Ordered): Ctrl + Shift + O
    listOrdered: {
        key: 'O',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('list', context.format.list === 'ordered' ? false : 'ordered');
        }
    },
    // List (Bullet): Ctrl + Shift + U
    listBullet: {
        key: 'U',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('list', context.format.list === 'bullet' ? false : 'bullet');
        }
    },
    // Indent: Tab
    indent: {
        key: 'Tab',
        handler: function (range, context) {
            this.quill.format('indent', '+1');
        }
    },
    // Outdent: Shift + Tab
    outdent: {
        key: 'Tab',
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('indent', '-1');
        }
    },
    // Align Left: Ctrl + Shift + L
    alignLeft: {
        key: 'L',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('align', context.format.align === 'left' ? false : 'left');
        }
    },
    // Align Center: Ctrl + Shift + E
    alignCenter: {
        key: 'E',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('align', context.format.align === 'center' ? false : 'center');
        }
    },
    // Align Right: Ctrl + Shift + R
    alignRight: {
        key: 'R',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('align', context.format.align === 'right' ? false : 'right');
        }
    },
    // Align Justify: Ctrl + Shift + J
    alignJustify: {
        key: 'J',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('align', context.format.align === 'justify' ? false : 'justify');
        }
    },
    // Link: Ctrl + K
    link: {
        key: 'K',
        shortKey: true,
        handler: function (range, context) {
            if (context.format.link) {
                this.quill.format('link', false);
            } else {
                const value = prompt('Enter the URL:');
                this.quill.format('link', value);
            }
        }
    },
    // Image: Ctrl + Shift + I
    image: {
        key: 'I',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            const value = prompt('Enter the image URL:');
            this.quill.insertEmbed(range.index, 'image', value);
        }
    },
    // Video: Ctrl + Shift + V
    video: {
        key: 'V',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            const value = prompt('Enter the video URL:');
            this.quill.insertEmbed(range.index, 'video', value);
        }
    },
    // Formula: Ctrl + Shift + F
    formula: {
        key: 'F',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            const value = prompt('Enter the formula:');
            this.quill.insertEmbed(range.index, 'formula', value);
        }
    },
    // Clean: Ctrl + Shift + Backspace
    clean: {
        key: 'Backspace',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.removeFormat(range.index, range.length);
        }
    }
};

export default customBindings;
