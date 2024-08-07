'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogOverlay, DialogPortal, DialogTrigger, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';

const NoteConfigDialog = ({ note }) => {
    const [title, setTitle] = useState(note.title);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className='cursor-pointer flex justify-between items-center w-full' onClick={(e) => { e.stopPropagation() }}>
                    Edit <Pen className='h-4 w-5' />
                </span>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent aria-describedby={note.title} className='w-11/12 rounded-lg'>
                    <DialogTitle id={note.title}>Edit Note</DialogTitle>
                    <DialogDescription>Edit your note title and other things. Save changes when you done.</DialogDescription>
                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}

export default NoteConfigDialog;