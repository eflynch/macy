import React, { useContext }  from 'react';

import MacyContext from '../context';

import SessionView from './session-view';
import SessionList from './session-list';

export default function App(props) {
    const {state, dispatch} = useContext(MacyContext);
    return (
        <div>
            <SessionView {...state.session} />
            <SessionList sessionList={state.sessionList} dirtyFlag={state.dirtyFlag} />
        </div>
    );
};
