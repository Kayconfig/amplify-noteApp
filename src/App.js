import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExport from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { listNotes } from './graphql/queries';
import { deleteNotes } from './graphql/mutations';
import {
  onCreateNotes,
  onDeleteNotes,
  onUpdateNotes,
} from './graphql/subscriptions';
import { useState, useEffect } from 'react';

import { NoteForm } from './components/Form';
import { Header } from './components/Header';
import { Main } from './components/main';
import { NoteList } from './components/NoteList';

Amplify.configure(awsExport);

function App(props) {
  const { user, signOut } = props;
  const [state, setState] = useState({
    note: '',
    disableBtn: false,
    notes: [],
  });

  useEffect(() => {
    const createSubscription = getOnCreateSub();
    const deleteSubscription = getOnDeleteSub();
    const updateSubscription = getOnUpdateSub();
    getNoteList();

    return () => {
      createSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
      updateSubscription.unsubscribe();
    };
  }, []);

  const getNoteList = () => {
    API.graphql(graphqlOperation(listNotes)).then((response) =>
      setState((prevState) => ({
        ...prevState,
        notes: response.data.listNotes.items,
      }))
    );
  };

  const getOnCreateSub = () => {
    return API.graphql({
      query: onCreateNotes,
      variables: { owner: user.username },
    }).subscribe({
      next: ({ provider, value }) => {
        console.log(value.data);
        setState((prev) => ({
          ...prev,
          disableBtn: false,
          notes: [...prev.notes, value.data.onCreateNotes],
        }));
      },
      error: (error) => console.warn(error),
    });
  };

  const getOnDeleteSub = () => {
    return API.graphql({
      query: onDeleteNotes,
      variables: { owner: user.username },
    }).subscribe({
      next: ({ provider, value }) => {
        const deletedNote = value.data.onDeleteNotes;
        setState((prev) => ({
          ...prev,
          notes: prev.notes.filter((note) => note.id !== deletedNote.id),
        }));
      },
    });
  };

  const getOnUpdateSub = () => {
    return API.graphql({
      query: onUpdateNotes,
      variables: { owner: user.username },
    }).subscribe({
      next: ({ _, value }) => {
        const updatedNote = value.data.onUpdateNotes;
        setState((prev) => ({
          ...prev,
          notes: prev.notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          ),
        }));
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteNotes, { input: { id } }));
    } catch (err) {
      alert('Unable to delete Item');
    }
  };
  return (
    <div className="rootDiv">
      <Header user={user} signOut={signOut} />
      <Main>
        <NoteForm state={state} setState={setState} />
        {/* Note List */}
        <NoteList notes={state.notes} handleDelete={handleDelete} />
      </Main>
    </div>
  );
}

export default withAuthenticator(App);
