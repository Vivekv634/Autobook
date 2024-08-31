'use client';
import Note from '@/app/components/Note';
import { useSelector } from 'react-redux';

const FavoriteComponent = () => {
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const favoriteNotes = notes.filter((note) => note.isFavorite);

  return (
    <section className="p-2 flex flex-col">
      {favoriteNotes.length ? (
        favoriteNotes.map((note, index) => {
          return (
            <Note
              key={index}
              note={note}
              notesDocID={user.userData.notesDocID}
              notebook_name={notebooks[note.notebook_ref_id].notebookName}
            />
          );
        })
      ) : (
        <div className="">No favorite notes here.</div>
      )}
    </section>
  );
};

export default FavoriteComponent;
