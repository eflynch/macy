
const macy = (state, action) => {
    switch (action.type) {
        case 'LOAD_SESSION':
        case 'NEW_SESSION':
        case 'SAVE_SESSION': {
            let session = action.payload;

            this._sessionWrapper = new SessionWrapper(session, (newState)=>{
                this.emit(CHANGE);
            });
            this._dirtyFlag = false;
            this.emit(CHANGE);
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
