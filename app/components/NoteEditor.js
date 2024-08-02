'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import QuillEditor from './TextEditor';

const NoteEditor = ({ params }) => {
    const { editorNote, isEditorNote } = useSelector(state => state.note);
    const { noteID } = params;
    const router = useRouter();

    window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
    });

    useEffect(() => {
        if (!isEditorNote) {
            router.back();
        }
    }, [isEditorNote, router]);

    return (
        <>
            <QuillEditor data={editorNote?.body} />
        </>
    )
}

export default NoteEditor;