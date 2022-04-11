import { useState } from 'react';
import { NoteForm } from './Form';

export function NoteItem({ item, handleDelete }) {
  const [state, setState] = useState({
    note: item.content,
    disableBtn: false,
    showEditForm: false,
  });

  const { showEditForm } = state;

  return (
    <div key={item.id} className="flex items-center">
      <li className="list pa1 f3">
        {showEditForm ? (
          <NoteForm state={state} setState={setState} id={item.id} />
        ) : (
          <div>
            <span className={'mr3'}>{item.content}</span>
            <button
              style={{ cursor: 'pointer' }}
              className="mr1"
              onClick={() => handleDelete(item.id)}
            >
              <span>Delete</span>
            </button>

            <button
              style={{ cursor: 'pointer' }}
              className="mr1"
              onClick={() =>
                setState((prev) => ({ ...prev, showEditForm: true }))
              }
            >
              <span>Edit</span>
            </button>
          </div>
        )}
      </li>
    </div>
  );
}
