import React, { useReducer, useEffect } from 'react';
import {render} from 'react-dom';

import App from './components/app';
import rootReducer from './reducers';
import MacyContext from './context';


const Main = ({initialState}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    useEffect(()=> {
    }, [state.macy]);

    return (
        <MacyContext.Provider value={{state, dispatch}} >
            <App />
        </MacyContext.Provider>
    );
}

const main = () => {
    // Actions.newSession("War in H2", "specs/trad.json");
    render(<Main initialState={{
        
    }} />, document.getElementById("content"));
};


document.addEventListener("DOMContentLoaded", function (){
    main();
});
