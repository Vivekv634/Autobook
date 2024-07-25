"use client"

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});
const modules = {
    toolbar: [
        [{ 'font': ['sans-serif', 'serif', 'monospace'] }],
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
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const formats = [
    'font', 'header', 'size', 'color', 'background','script',
    'align', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'video', 'code-block', 'formula'
];

export default function TextEditor() {
    const [content, setContent] = useState('');
    return (
        <div className='container m-auto mt-5'>
            <ReactQuill
                placeholder='Start editing...'
                formats={formats}
                modules={modules}
                theme='snow'
                value={content}
                onChange={setContent}
            />
            {content}
        </div>
    );
}