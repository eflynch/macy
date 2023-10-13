
export const NEW_SESSION = (title, boardSpecURI, dispatch) => ({
    type: 'NEW_SESSION',
    title,
    boardSpecURI,
    dispatch
});

export const CLONE_SESSION = (title, boardSpecURI) => ({
    type: 'CLONE_SESSION',
    title
});

export const LOAD_SESSION = (URI) => ({
    type: 'LOAD_SESSION',
    URI
});

export const TAP_TERRITORY = (territory) => ({
    type: 'TAP_TERRITORY',
    territory
});

export const RESOLVE_ORDERS = () => ({
    type: 'RESOLVE_ORDERS'
});

export const REVERT_TO_CURRENT_TURN = () => ({
    type: 'REVERT_TO_CURRENT_TURN'
});

export const SET_TURN = (turn) => ({
    type: 'SET_TURN',
    turn
});

export const SET_ORDER_MODE = (orderMode) => ({
    type: 'SET_ORDER_MODE',
    orderMode
});

export const SUBMIT_ORDERS = () => ({
    type: 'SUBMIT_ORDERS'
});

export const ADJUDICATE = () => ({
    type: 'ADJUDICATE'
});

export const UPDATE = (newState) => ({
    type: 'UPDATE',
    newState
});


export default {
    NEW_SESSION: NEW_SESSION,
    LOAD_SESSION: LOAD_SESSION,
    TAP_TERRITORY: TAP_TERRITORY,
    RESOLVE_ORDERS: RESOLVE_ORDERS,
    REVERT_TO_CURRENT_TURN: REVERT_TO_CURRENT_TURN,
    SET_TURN: SET_TURN,
    SET_ORDER_MODE: SET_ORDER_MODE,
    SUBMIT_ORDERS: SUBMIT_ORDERS,
    ADJUDICATE: 'ADJUDICATE',
}
