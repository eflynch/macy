import Dispatcher from './dispatcher';
import ActionTypes from './constants';
import {copyTextToClipboard, getTextFromClipboard, getJSON} from './web-utils';
import {NewSession, LoadSessionFromSerializable, SaveSessionToSerializable} from './session';


class Actions {
    newSession(title, boardSpecURI) {
        getJSON(boardSpecURI, (err, serializableBoardSpec) => {
            const session = NewSession(title, serializableBoardSpec);
            const serializableSession = SaveSessionToSerializable(session);
            // TODO: post new session
            Dispatcher.dispatch({
                actionType: ActionTypes.NEW_SESSION,
                payload: session
            });
        });
    }

    cloneSession(session, title) {
        const serializableSession = SaveSessionToSerializable(session);
        serializableSession.title = title;
        // TODO: post new session
        LoadSessionFromSerializable(serializableSession, (session) => {
            Dispatcher.dispatch({
                actionType: ActionTypes.NEW_SESSION,
                payload: session
            });
        });
    }

    loadSession(uri) {
       getJSON(uri, (err, data) => {
            LoadSessionFromSerializable(data, (session) => {
                Dispatcher.dispatch({
                    actionType: ActionTypes.LOAD_SESSION,
                    payload: session
                });
            });
        }); 
    }

    loadSessionFromClipboard() {
        getTextFromClipboard().then((text) => {
            LoadSessionFromSerializable(JSON.parse(text), (session) => {
                Dispatcher.dispatch({
                    actionType: ActionTypes.LOAD_SESSION,
                    payload: session
                });
            });
        });
    }

    saveSessionToClipboard(session) {
        const serializableSession = SaveSessionToSerializable(session);
        copyTextToClipboard(JSON.stringify(serializableSession));
        Dispatcher.dispatch({
            actionType: ActionTypes.SAVE_SESSION,
            payload: session
        });
    }

    setOrderMode(orderMode) {
        Dispatcher.dispatch({
            actionType: ActionTypes.SET_ORDER_MODE,
            payload: orderMode 
        });
    }

    tapTerritory(territory) {
        Dispatcher.dispatch({
            actionType: ActionTypes.TAP_TERRITORY,
            payload: territory 
        });
    }

    setTurn(turn) {
        Dispatcher.dispatch({
            actionType: ActionTypes.SET_TURN,
            payload: turn 
        });
    }

    resolveOrders() {
        Dispatcher.dispatch({
            actionType: ActionTypes.RESOLVE_ORDERS,
        });
    }

    revertToCurrentTurn() {
        Dispatcher.dispatch({
            actionType: ActionTypes.REVERT_TO_CURRENT_TURN,
        });
    }

    submitOrders() {
        // TODO : submit orders 
    }

    adjudicate() {
        // TODO : submit orders
    }
}

export default new Actions();
