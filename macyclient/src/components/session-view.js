import React, { useContext, useState, useEffect } from 'react';

import MacyContext from '../context';
import {SET_ORDER_MODE, SET_TURN, RESOLVE_ORDERS, REVERT_TO_CURRENT_TURN} from '../actions';

import Board from './board';
import MouseFollower from './mouse-follower';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';
import Help from './help';

const SessionView = ({turnState, orderState, session}) => {
    const [showOrders, setShowOrders] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const {dispatch} = useContext(MacyContext);

    useEffect(()=> {
        window.onkeydown = (e) => {
            if (e.keyCode === 77) { // m
                dispatch(SET_ORDER_MODE("Move"));
            } else if (e.keyCode === 86) { // v
                dispatch(SET_ORDER_MODE("Move (Convoy)"));
            } else if (e.keyCode === 83) { // s
                dispatch(SET_ORDER_MODE("Support"));
            } else if (e.keyCode === 67) { // c
                dispatch(SET_ORDER_MODE("Convoy"));
            } else if (e.keyCode === 65) { // a
                dispatch(SET_ORDER_MODE("Build Army"));
            } else if (e.keyCode === 70) { // f
                dispatch(SET_ORDER_MODE("Build Fleet"));
            } else if (e.keyCode === 68) { // d
                dispatch(SET_ORDER_MODE("Disband"));
            } else if (e.keyCode === 81) { // q
                dispatch(SET_ORDER_MODE("Retreat"));
            } else if (e.keyCode === 191) { // ?
                setShowHelp(!showHelp);
            } else if (e.keyCode === 78) { // n
                dispatch(SET_TURN(turnState.turn + 1));
            } else if (e.keyCode === 80) { // p
                dispatch(SET_TURN(turnState.turn - 1));
            } else if (e.keyCode === 82) { // r
                dispatch(RESOLVE_ORDERS());
            } else if (e.keyCode === 88) { // x
                dispatch(REVERT_TO_CURRENT_TURN());
            }
        }
        return () => {
            window.onkeydown = undefined;
        }
    });

    const boardSpec = session.boardSpec;
    const turns = session.turns.concat(turnState.mutableTurns);
    const turn = turnState.turn;
    let orders = turns[turn];
    const orderable = orders.length === 0 && turns.length === turn + 1;
    if (orderable){
        orders = Object.values(orderState.orders);
    }
    let help = <span/>;
    if (showHelp){
        help = <Help/>;
    }

    return (
        <div>
            {help}
            <div className="main-header">
                <span className="site-title">MACY</span>
                <span className="session-title">{session.title}</span>
                <span className="spec-title">({boardSpec.title})</span>
                <a onClick={toggleHelp}>help</a>
                <a onClick={saveSession}>save</a>
                <a onClick={loadSession}>load</a>
            </div>
            <div className="main">
                <div className="board-container">
                    <Board clickTerritory={Actions.tapTerritory}
                           orders={showOrders ? orders : []}
                           boardSpec={boardSpec}
                           gameState={gameState}
                           orderState={orderState}/>
                    <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                </div>
                <OrdersList
                    turn={turn}
                    showResolve={orderable && turn == turns.length - 1}
                    showRevert={turn < turns.length - 1 && turn >= session.turns.length}
                    orders={orders}
                    boardSpec={boardSpec}
                    gameState={gameState}
                    showOrders={showOrders}
                    orderMode={orderState.orderMode}
                    toggleShowOrders={()=>{
                        setShowOrders(!showOrders);
                    }}
                />
            </div>
        </div>
    );
};
export default SessionView;
