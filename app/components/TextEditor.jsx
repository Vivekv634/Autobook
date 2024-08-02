"use client";

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import './texteditor.css';
import KeyboardBindings from '@/app/utils/keyboardBindings';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function QuillEditor({data}) {
    const [content, setContent] = useState(data);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const Quill = require('react-quill').Quill;
            const Font = Quill.import('formats/font');
            Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'poppins', 'quicksand', 'ubuntu', 'montserrat'];
            Quill.register(Font, true);
        }
    }, [isClient]);

    const modules = {
        toolbar: [
            [{ 'font': isClient ? ['sans-serif', 'serif', 'monospace', 'roboto', 'poppins', 'quicksand', 'ubuntu', 'montserrat'] : [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean'],
            ['formula']
        ],
        clipboard: {
            matchVisual: false,
        },
        keyboard: {
            bindings: isClient ? KeyboardBindings : {}
        }
    };

    const formats = [
        'font', 'header', 'size', 'color', 'background', 'script',
        'align', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image', 'video', 'code-block', 'formula'
    ];

    return (
        <div className="text-editor-container">
            {isClient && (
                <ReactQuill
                    placeholder='Start editing...'
                    formats={formats}
                    modules={modules}
                    theme='snow'
                    value={content}
                    onChange={setContent}
                />
            )}
        </div>
    );
}
