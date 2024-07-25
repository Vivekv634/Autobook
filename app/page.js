"use client";
import React from 'react';
import TextEditor from './components/TextEditor';
import './globals.css';

export default function Home() {
  return (
      <div className='container m-auto mt-5'>
        <TextEditor />
      </div>
  );
}