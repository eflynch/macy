import {NewSession, SessionWrapper} from '../session';

import {UPDATE} from '../actions';

const macy = (outerState, action) => {
    const {state, sessionWrapper} = outerState;

    switch (action.type) {
        case 'UPDATE': {
            const {newState} = action;
            
        }
        case 'NEW_SESSION': {
            const {title, boardSpecURI, dispatch} = action;

            const session = NewSession(title, boardSpecURI);

            const sessionWrapper = new SessionWrapper(session, (newState)=>{
                dispatch(UPDATE(newState));
            });
            return {
                session: session,
                sessionList: [],
                dirtyFlag: false
            };
        }
        case 'LOAD_SESSION': {
            break;
        }
        case 'SET_ORDER_MODE': {
            let orderMode = action.payload;
            if (this._sessionWrapper){
                this._sessionWrapper.setOrderMode(orderMode);
            }
            break;
        }
        case 'TAP_TERRITORY': {
            let territory = action.payload;
            if (this._sessionWrapper) {
                this._sessionWrapper.tapTerritory(territory);
            }
            break;
        }
        case 'SET_TURN': {
            let turn = action.payload;
            if (this._sessionWrapper) {
                this._sessionWrapper.setTurn(turn);
            }
            break;
        }
        case 'RESOLVE_ORDERS': {
            if (this._sessionWrapper) {
                this._dirtyFlag = true;
                this._sessionWrapper.resolveOrders();
            }
            break;
        }
        case 'REVERT_TO_CURRENT_TURN': {
            if (this._sessionWrapper) {
                this._dirtyFlag = true;
                this._sessionWrapper.revertToCurrentTurn();
            }
            break;
        } 
    }
    return state;
}
export default macy;
