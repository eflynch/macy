import {loadBoardSpec} from './board-spec';
import {getJSON} from './web-utils';

const newSession = (title, boardSpecURI, callback) => {
    getJSON(boardSpecURI, (err, data) => {
        const session = {
            title: title,
            boardSpec: loadBoardSpec(boardSpec),
            turns: []
        };
        const boardSpec = loadBoardSpec(data);
        session.boardSpec = boardSpec;
        callback(session);
    });
}

const loadSession = (session, callback) => {
    const boardSpecURI = session.boardSpecURI;

    getJSON(session.boardSpecURI, (err, data) => {
        const boardSpec = loadBoardSpec(data);
        session.boardSpec = boardSpec;
        callback(session);
    });
}

const saveSession = (session) => {
    delete session.boardSpec;
    return session;
}


module.exports = {
    newSession: newSession,
    loadSession: loadSession,
    saveSession: saveSession,
};
