import update from 'immutability-helper';
import { EventEmitter } from 'events';
import Dispatcher from './dispatcher';
import ActionTypes from './constants';

import {SessionWrapper, newSession, loadSession, saveSession} from './session';

const CHANGE = 'CHANGE';


class Store extends EventEmitter {
    constructor() {
        super();

        Dispatcher.register(this._handleAction.bind(this));
        this._sessionWrapper = null;
    }

    _handleAction(action) {
        switch(action.actionType) {
            case ActionTypes.LOAD_SESSION:
            case ActionTypes.NEW_SESSION:
            case ActionTypes.SAVE_SESSION: {
                let session = action.payload;

                this._sessionWrapper = new SessionWrapper(session, (newState)=>{
                    this.emit(CHANGE);
                });
                this.emit(CHANGE);
                break;
            }
            case ActionTypes.SET_ORDER_MODE: {
                let orderMode = action.payload;
                if (this._sessionWrapper){
                    this._sessionWrapper.setOrderMode(orderMode);
                }
                break;
            }
            case ActionTypes.TAP_TERRITORY: {
                let territory = action.payload;
                if (this._sessionWrapper) {
                    this._sessionWrapper.tapTerritory(territory);
                }
                break;
            }
            case ActionTypes.SET_TURN: {
                let turn = action.payload;
                if (this._sessionWrapper) {
                    this._sessionWrapper.setTurn(turn);
                }
                break;
            }
            case ActionTypes.RESOLVE_ORDERS: {
                if (this._sessionWrapper) {
                    this._sessionWrapper.resolveOrders();
                }
                break;
            }
            case ActionTypes.REVERT_TO_CURRENT_TURN: {
                if (this._sessionWrapper) {
                    this._sessionWrapper.revertToCurrentTurn();
                }
                break;
            }
        }
    }

    getState() {
        if (this._sessionWrapper) {
            return this._sessionWrapper.getState();
        } else {
            return {};
        }
    }

    addOnChange(callback) {
        this.on(CHANGE, callback);
    }

    removeOnChange(callback) {
        this.removeListener(CHANGE, callback);
    }
}

export default new Store();
