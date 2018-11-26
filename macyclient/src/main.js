import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';

import Graph from './graph';
import App from './app';
import {loadSession, saveSession} from './session';
import {copyTextToClipboard, getTextFromClipboard, getJSON} from './web-utils';
import update from 'immutability-helper';  

const main = () => {
    let saveSessionToClipboard = (session) => {
        copyTextToClipboard(JSON.stringify(saveSession(session)));
    };

    let loadSessionFromClipboard = () => {
        loadSession(JSON.parse(getTextFromClipboard()), (session) => {
            render(<App session={session} saveSession={saveSessionToClipboard} loadSession={loadSessionFromClipboard}/>, document.getElementById("content"));
        });
    };

    getJSON("testSession.json", (err, data) => {
        loadSession(data, (session) => {
            render(<App session={session} saveSession={saveSessionToClipboard} loadSession={loadSessionFromClipboard}/>, document.getElementById("content"));
        });
    });
    
    
};


document.addEventListener("DOMContentLoaded", function (){
    main();
});
