"use client"
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import html2pdf from 'html2pdf.js';
import { FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExportPdfDialog = ({ note }) => {
    const titleId = 'dialog-title';

    const downloadPdf = (e) => {
        e.stopPropagation();
        html2pdf()
            .from(note.body)
            .set({
                margin: 1,
                filename: `${note.title}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            })
            .save();
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className='cursor-pointer flex justify-between items-center w-full' onClick={(e) => { e.stopPropagation() }}>
                    PDF
                    <FileTextIcon className='h-4 w-5' />
                </span>
            </DialogTrigger>
            <DialogContent aria-describedby={titleId} className='w-11/12 rounded-lg' onClick={(e) => { e.stopPropagation() }}>
                <DialogTitle id={titleId}>Export Note as PDF</DialogTitle>
                <DialogDescription>Get your converted PDF by clicking the download button.</DialogDescription>
                <DialogFooter>
                    <Button variant='outline' onClick={downloadPdf} className="btn btn-primary">
                        Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExportPdfDialog;
