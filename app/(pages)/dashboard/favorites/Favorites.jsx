'use client';
import Note from '@/app/components/Note';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import NoteNotFoundSVG from '@/public/note-not-found.svg';

const FavoriteComponent = () => {
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const favoriteNotes = notes.filter((note) => note.isFavorite);

  return (
    <>
      <section className="p-2 flex gap-4 flex-col">
        {favoriteNotes.length != 0 &&
          favoriteNotes.map((note, index) => {
            return (
              <Note
                key={index}
                note={note}
                notesDocID={user?.userData?.notesDocID}
                notebook_name={notebooks[note.notebook_ref_id]?.notebookName}
              />
            );
          })}
      </section>
      {favoriteNotes.length == 0 && (
        <section className="flex justify-center items-center h-full">
          <div className="flex text-center h-inherit justify-center align-center">
            <div>
              <Image
                src={NoteNotFoundSVG}
                alt="Notebook not created yet!"
                loading="lazy"
              />
              <Label className="text-lg">Note not created yet!</Label>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FavoriteComponent;
