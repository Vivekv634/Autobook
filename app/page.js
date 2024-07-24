"use client"; // Add this line to mark the component as a Client Component

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './globals.css'; // Optional: Custom CSS for your component

import Image from "next/image";

// Define the custom toolbar options
const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],
  [{ 'size': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean'] // Remove formatting button
];

export default function Home() {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="container">
        <div className="row">
          <div className="editor">
            <ReactQuill
              value={editorContent}
              onChange={handleEditorChange}
              theme="snow"
              placeholder="Start typing..."
              className="editor-input"
            />
          </div>
          <div className="preview">
            <h3></h3>
            <div dangerouslySetInnerHTML={{ __html: editorContent }} />
          </div>
        </div>
      </div>
    </main>
  );
}