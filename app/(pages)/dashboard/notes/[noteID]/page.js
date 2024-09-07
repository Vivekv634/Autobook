import React from 'react'
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import NoteEditor from '@/app/components/NoteEditor';

export async function generateMetadata({ params }) {
    let cookie, notesDocID;
    if (hasCookie('user-session-data')) {
        cookie = JSON.parse(getCookie('user-session-data'));
        console.log('cookie:', cookie)
        notesDocID = cookie?.userDoc?.notesDocID;
    }
    const { noteID } = params;
    console.log(notesDocID, noteID)
    console.log(process.env.API)

    const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
        headers: {
            notesDocID: notesDocID
        }
    })

    return {
        title: response.data.result
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