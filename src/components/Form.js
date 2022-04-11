import { listNotes } from '../graphql/queries';
import { createNotes, deleteNotes, updateNotes } from '../graphql/mutations';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { onCreateNotes } from '../graphql/subscriptions';
import { useState, useEffect, useMemo } from 'react';

export function NoteForm({ state, setState, id }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!state.note) {
      alert('Field cannot be empty!');
      return;
    }
    const dataToSubmit = { content: state.note };
    //add id if the id is supplied ( implying an update)
    if (id) dataToSubmit.id = id;
    const actionToPerform = id ? updateNotes : createNotes;
    try {
      if (!id) {
        setState((prev) => ({ ...prev, disableBtn: true }));
      }
      API.graphql(graphqlOperation(actionToPerform, { input: dataToSubmit }));
      if (id) {
        setState((prev) => ({ ...prev, showEditForm: false }));
      } else {
        setState((prev) => ({ ...prev, note: '' }));
      }
    } catch (err) {
      console.log(err);
      alert('Unable to create note');
    }
  };
  const handleCancel = () => {
    setState((prev) => ({ ...prev, showEditForm: false }));
  };

  const btnText = useMemo(() => {
    if (id) {
      if (state.disableBtn) {
        return 'Updating Note';
      } else {
        return 'Update Note';
      }
    } else {
      if (state.disableBtn) {
        return 'Adding Note';
      } else {
        return 'Add Note';
      }
    }
  }, [state.disableBtn, id]);

  return (
    <form className="mb4" onSubmit={handleSubmit}>
      <input
        className="pa2 f4"
        type={'text'}
        placeholder="write your note."
        value={state.note}
        disabled={state.disableBtn}
        onChange={(e) =>
          setState((prevState) => ({ ...prevState, note: e.target.value }))
        }
      />

      <button className="pa2 f4" disabled={state.disableBtn}>
        {btnText}
      </button>
      {id && (
        <button className="pa2 f4" onClick={handleCancel}>
          {'Cancel'}
        </button>
      )}
    </form>
  );
}
