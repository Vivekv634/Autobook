import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const DeleteAutoNoteDialog = ({ autoNote, open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>{JSON.stringify(autoNote)}</DialogContent>
    </Dialog>
  );
};

export default DeleteAutoNoteDialog;
