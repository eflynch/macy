import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';

import Graph from './graph';
import App from './app';
import {session} from './game';

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}


function getTextFromClipboard() {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    let text = "";
    try {
        var successful = document.execCommand('paste');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
        let text = textArea.value;
    } catch (err) {
        console.log('Oops, unable to copy');
        return "";
    }
    document.body.removeChild(textArea);
    return text;
}


let saveSession = (session) => {
    copyTextToClipboard(JSON.stringify(session));
};

let loadSession = () => {
    let session_from_cb = JSON.parse(getTextFromClipboard());
    session_from_cb.boardSpec = session.boardSpec;
    render(<App session={session_from_cb} saveSession={saveSession} loadSession={loadSession}/>, document.getElementById("content"));
};

document.addEventListener("DOMContentLoaded", function (){
    render(<App session={session} saveSession={saveSession} loadSession={loadSession}/>, document.getElementById("content"));
});
