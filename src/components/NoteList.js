import { NoteItem } from './NoteItem';

export function NoteList({ notes, handleDelete }) {
  return (
    <div>
      {notes.map((item) => (
        <NoteItem item={item} handleDelete={handleDelete} />
      ))}
    </div>
  );
}
