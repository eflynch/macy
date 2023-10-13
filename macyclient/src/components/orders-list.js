import React, { useContext } from 'react';

import MacyContext from '../context';
import {RESOLVE_ORDERS, REVERT_TO_CURRENT_TURN, SET_ORDER_MODE, SET_TURN} from '../actions';

import utils from '../game/utils';

let Order = (props) => {
    let {order} = props;
    return <div>{utils.formatOrder(order)}</div>;
};

const OrdersList = ({orderMode, gameState, showOrders, turn, toggleShowOrders, orders, showResolve, showRevert}) => {
    const {dispatch} = useContext(MacyContext);

    let showOrdersIcon = <span>[&nbsp;&nbsp;]</span>;
    if (showOrders) {
        showOrdersIcon = <span>[x]</span>;
    }

    let orderModes = utils.getAllowedOrderModes(gameState.season);

    let resolve = <span/>;
    if (showResolve){
        resolve = <div className="resolve-button" onClick={()=>{dispatch(RESOLVE_ORDERS());}}>Resolve Orders</div>;
    }

    let revert = <span/>;
    if (showRevert){
        revert = <div className="revert-button" onClick={()=>{dispatch(REVERT_TO_CURRENT_TURN());}}>Revert To This Season</div>;
    }

    let localOrders = {};
    for (let order of orders) {
        if (localOrders.hasOwnProperty(order.faction)) {
            localOrders[order.faction].push(order);
        } else {
            localOrders[order.faction] = [order];
        }
    }
    let factionsWithOrders = Object.keys(localOrders);

    return (
        <div className="order-list">
            <div className="order-types">
                {orderModes.map((om)=>{
                    return <li key={om} onClick={()=>{dispatch(SET_ORDER_MODE(om));}} className={orderMode === om ? "selected" : ""}>{om}</li>;
                })}
            </div>
            <div className="show-button" onClick={toggleShowOrders}>{showOrdersIcon}Show Orders on Map</div>
            <div className="order-header">
                <span style={{cursor:"pointer"}} onClick={()=>{
                    dispatch(SET_TURN(turn - 1));
                }}>←</span>
                <span>{gameState.season} {gameState.year}</span>
                <span style={{cursor:"pointer"}} onClick={()=>{
                    dispatch(SET_TURN(turn + 1));
                }}>→</span>
            </div>
            {factionsWithOrders.map((faction) => {
                return (
                    <div key={faction}>
                        <div className="order-faction">{faction}</div>
                        {localOrders[faction].map((order, i) => <Order order={order} key={i}/>)}
                    </div>);
            })}
            {resolve}
            {revert}
        </div>
    );
};
export default OrdersList;
