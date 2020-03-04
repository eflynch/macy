import React from 'react';
import {render} from 'react-dom';

import App from './components/app';
import Store from './store';
import Actions from './actions';

import {generate} from './board-specs/trad';
window.generate = generate;

const main = () => {
    Store.addOnChange(() => {
        const state = Store.getState();
        render(<App {...state} />, document.getElementById("content"));
    });
    Actions.loadSession("testSession2.json");
};


document.addEventListener("DOMContentLoaded", function (){
    main();
});
