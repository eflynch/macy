import React from 'react';

import Board from './board';
import {resolve} from './resolve';


class SupplyCenters extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {show: null};
    }

    render () {
        let {gameState, boardSpec} = this.props;
        const factions = Object.keys(gameState.factions);
        return (
            <div className="supply-centers">
                {factions.map((faction) => {
                    let show = "";
                    if (this.state.show === faction){
                        show = (
                            <div className="supply-center-item-list">
                                {gameState.factions[faction].supplyCenters.map((center)=><span>{center}</span>)}
                            </div>
                        );
                    }
                    return (
                        <div className="supply-center-item" key={faction} style={{background: boardSpec.factions[faction].color}} onClick={(e) => {
                                this.setState({show: this.state.show === faction ? null : faction});
                            }}>
                            <div className="supply-center-item-content">
                                <div className="supply-center-item-title">
                                    <span>{faction}</span>
                                    <span>{gameState.factions[faction].supplyCenters.length}</span>
                                </div>
                                {show}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

class OrdersList extends React.PureComponent {
    render () {
        return (
            <div className="order-list">
                <div className="show-button" onClick={this.props.toggleShowOrders}>Show on Map</div>
                <div className="order-header">
                    <span style={{cursor:"pointer"}} onClick={this.props.goBack}>←</span>
                    <span>{this.props.gameState.season} {this.props.gameState.year}</span>
                    <span style={{cursor:"pointer"}} onClick={this.props.goForward}>→</span>
                </div>
                {this.props.orders.map((order, i) => {
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
                })}
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            turn: props.session.turns.length - 1,
            showOrders: true,
            selectedTerritory: "Iceland" 
        };
    }
    render () {
        let boardSpec = this.props.session.boardSpec;
        let gameState = JSON.parse(JSON.stringify(boardSpec.startingGameState));
        for (let orders of this.props.session.turns.slice(0, this.state.turn)) {
            gameState = resolve(boardSpec, gameState, orders);
        }
        let orders = this.props.session.turns[this.state.turn];
        return (
            <div>
                <h1>{this.props.session.title} ({this.props.session.boardSpec.title})</h1>
                <div className="main">
                    <div className="board-container">
                        <Board setSelected={(territory)=>{
                            this.setState({selectedTerritory: territory});
                        }} orders={this.state.showOrders ? orders : []} boardSpec={boardSpec} gameState={gameState} selectedTerritory={this.state.selectedTerritory}/>
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList orders={orders} boardSpec={boardSpec} gameState={gameState}
                        toggleShowOrders={()=>{this.setState({showOrders: !this.state.showOrders});}}
                        goBack={()=>{this.setState({turn: Math.max(0, this.state.turn -1)})}}
                        goForward={()=>{this.setState({turn: Math.min(this.props.session.turns.length - 1, this.state.turn + 1)})}}/>
                </div>
            </div>
        );
    }
}


module.exports = App;
