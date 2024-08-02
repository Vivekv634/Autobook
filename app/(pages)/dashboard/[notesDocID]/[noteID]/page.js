import NoteEditor from '@/app/components/NoteEditor';
import axios from 'axios';
import React from 'react';

export async function generateMetadata({ params }) {
    const { notesDocID, noteID } = params;

    const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
        headers: {
            notesDocID: notesDocID
        }
    })

    return {
        title: response.data.result.title ?? 'Untitled'
    }
}

const NoteEditorPage = ({ params }) => {
    return (
        <>
            <NoteEditor params={params} />
        </>
    )
}

export default NoteEditorPage;