import React from 'react';

import utils from './utils';

let Order = (props) => {
    let {order} = props;
    return <div>{utils.formatOrder(order)}</div>;
};

class OrdersList extends React.PureComponent {
    render () {
        let {orderMode, setOrderMode, gameState} = this.props;

        let showOrdersIcon = <span>[&nbsp;&nbsp;]</span>;
        if (this.props.showOrders) {
            showOrdersIcon = <span>[x]</span>;
        }

        let orderModes = utils.getAllowedOrderModes(gameState.season);

        let resolve = <span/>;
        if (this.props.showResolve){
            resolve = <div className="resolve-button" onClick={this.props.resolveOrders}>Resolve Orders</div>;
        }

        let revert = <span/>;
        if (this.props.showRevert){
            revert = <div className="revert-button" onClick={this.props.revertOrders}>Revert To This Season</div>;
        }

        let orders = {};
        for (let order of this.props.orders) {
            if (orders.hasOwnProperty(order.faction)) {
                orders[order.faction].push(order);
            } else {
                orders[order.faction] = [order];
            }
        }
        let factionsWithOrders = Object.keys(orders);

        return (
            <div className="order-list">
                <div className="order-types">
                    {orderModes.map((om)=>{
                        return <li key={om} onClick={()=>{setOrderMode(om);}} className={orderMode === om ? "selected" : ""}>{om}</li>;
                    })}
                </div>
                <div className="show-button" onClick={this.props.toggleShowOrders}>{showOrdersIcon}Show Orders on Map</div>
                <div className="order-header">
                    <span style={{cursor:"pointer"}} onClick={this.props.goBack}>←</span>
                    <span>{this.props.gameState.season} {this.props.gameState.year}</span>
                    <span style={{cursor:"pointer"}} onClick={this.props.goForward}>→</span>
                </div>
                {factionsWithOrders.map((faction) => {
                    return (
                        <div key={faction}>
                            <div className="order-faction">{faction}</div>
                            {orders[faction].map((order, i) => <Order order={order} key={i}/>)}
                        </div>);
                })}
                {resolve}
                {revert}
            </div>
        );
    }
}

module.exports = OrdersList;
