import React from 'react';

class OrdersList extends React.PureComponent {
    render () {
        let showOrdersIcon = <span>[&nbsp;&nbsp;]</span>;
        if (this.props.showOrders) {
            showOrdersIcon = <span>[x]</span>;
        }

        const orderModes = ["Move", "Move (Convoy)", "Support", "Convoy", "Build Army", "Build Fleet", "Disband"];

        let {orderMode, setOrderMode} = this.props;

        let resolve = <span/>;
        if (this.props.showResolve){
            resolve = <div className="resolve-button" onClick={this.props.resolveOrders}>Resolve Orders</div>;
        }

        let revert = <span/>;
        if (this.props.showRevert){
            revert = <div className="revert-button" onClick={this.props.revertOrders}>Revert To This Season</div>;
        }

        // TODO: Doesn't work yet
        let orders = this.props.orders.concat().sort((a, b)=>a.power > b.power);


        return (
            <div className="order-list">
                <div className="order-types">
                    {orderModes.map((om)=>{
                        return <li key={om} onClick={()=>{setOrderMode(om.toLowerCase());}} className={orderMode === om.toLowerCase() ? "selected" : ""}>{om}</li>;
                    })}
                </div>
                <div className="show-button" onClick={this.props.toggleShowOrders}>{showOrdersIcon}Show Orders on Map</div>
                <div className="order-header">
                    <span style={{cursor:"pointer"}} onClick={this.props.goBack}>←</span>
                    <span>{this.props.gameState.season} {this.props.gameState.year}</span>
                    <span style={{cursor:"pointer"}} onClick={this.props.goForward}>→</span>
                </div>
                {orders.map((order, i) => {
                    let faction = this.props.gameState.factions[order.power];
                    let color = this.props.boardSpec.factions[order.power].color;

                    let powerCaption = <span className="order-power" >{order.power}</span>;

                    if (order.action === "Move") {
                        return <div key={i}>{powerCaption} {order.unit} -> {order.target}</div>;
                    }

                    if (order.action === "Support") {
                        if (order.target) {
                            return <div key={i}>{powerCaption} {order.unit} S {order.targetUnit} -> {order.target}</div>;
                        } else {
                            return <div key={i}>{powerCaption} {order.unit} S {order.targetUnit} H</div>;
                        }
                    }

                    if (order.action === "Hold") {
                        return <div key={i}>{powerCaption} {order.unit} H</div>;
                    }

                    if (order.action === "Convoy") {
                        return <div key={i}>{powerCaption} {order.unit} C {order.targetUnit} -> {order.target}</div>;
                    }

                    if (order.action === "Build") {
                        return <div key={i}>{powerCaption} build {order.unitType} {order.unit}</div>;
                    }

                    if (order.action === "Disband") {
                        return <div key={i}>{powerCaption} disband {order.unit}</div>;
                    }
                })}
                {resolve}
                {revert}
            </div>
        );
    }
}

module.exports = OrdersList;
