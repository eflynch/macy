import React, { useReducer, useEffect } from 'react';
import {render} from 'react-dom';

import App from './components/app';
import rootReducer from './reducers';
import MacyContext from './context';
import {NEW_SESSION} from './actions';


const Main = ({initialState}) => {
    const [outerState, dispatch] = useReducer(rootReducer, {state: initialState});
    useEffect(()=> {
        if (outerState.state.session === undefined) {
            dispatch(NEW_SESSION("War in H2", "specs/trad.json", dispatch));
        }
    }, [outerState.state]);

    const state = outerState.state;

    return (
        <MacyContext.Provider value={{state, dispatch}} >
            <App />
        </MacyContext.Provider>
    );
}

const main = () => {
    render(<Main initialState={{}} />, document.getElementById("content"));
};


document.addEventListener("DOMContentLoaded", function (){
    main();
});
