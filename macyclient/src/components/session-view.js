import React from 'react';

import Board from './board';
import MouseFollower from './mouse-follower';
import {resolve} from '../game/resolve';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';
import Help from './help';
import Actions from '../actions';


export default class SessionView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showOrders: true,
            showHelp: false
        };
    }

    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.keyCode === 77) { // m
                Actions.setOrderMode("Move");
            } else if (e.keyCode === 86) { // v
                Actions.setOrderMode("Move (Convoy)");
            } else if (e.keyCode === 83) { // s
                Actions.setOrderMode("Support");
            } else if (e.keyCode === 67) { // c
                Actions.setOrderMode("Convoy");
            } else if (e.keyCode === 65) { // a
                Actions.setOrderMode("Build Army");
            } else if (e.keyCode === 70) { // f
                Actions.setOrderMode("Build Fleet");
            } else if (e.keyCode === 68) { // d
                Actions.setOrderMode("Disband");
            } else if (e.keyCode === 81) { // q
                Actions.setOrderMode("Retreat");
            } else if (e.keyCode === 191) { // ?
                this.toggleHelp();
            } else if (e.keyCode === 78) { // n
                Actions.setTurn(this.props.turnState.turn + 1);
            } else if (e.keyCode === 80) { // p
                Actions.setTurn(this.props.turnState.turn - 1);
            } else if (e.keyCode === 82) { // r
                Actions.resolveOrders();
            } else if (e.keyCode === 88) { // x
                Actions.revertToCurrentTurn();
            } else if (e.keyCode === 79) { // o
                Actions.loadSessionFromClipboard();
            } else if (e.keyCode === 87) { // w
                Actions.saveSessionToClipboard(this.props.session);
            }
        };
    }

    toggleHelp = () => {
        this.setState({showHelp: !this.state.showHelp});
    };

    saveSession = () => {
        Actions.saveSessionToClipboard(this.props.session);
    };

    loadSession = () => {
        Actions.loadSessionFromClipboard();
    };

    render () {
        const boardSpec = this.props.session.boardSpec;
        const gameState = this.props.gameState;
        const turns = this.props.session.turns.concat(this.props.turnState.mutableTurns);
        const turn = this.props.turnState.turn;
        let orders = turns[turn];
        const orderable = orders.length === 0 && turns.length === turn + 1;
        if (orderable){
            orders = Object.values(this.props.orderState.orders);
        }
        let help = <span/>;
        if (this.state.showHelp){
            help = <Help/>;
        }

        return (
            <div>
                {help}
                <div className="main-header">
                    <span className="site-title">MACY</span>
                    <span className="session-title">{this.props.session.title}</span>
                    <span className="spec-title">({boardSpec.title})</span>
                    <a onClick={this.toggleHelp}>help</a>
                    <a onClick={this.saveSession}>save</a>
                    <a onClick={this.loadSession}>load</a>
                </div>
                <div className="main">
                    <div className="board-container">
                        <Board clickTerritory={Actions.tapTerritory}
                               orders={this.state.showOrders ? orders : []}
                               boardSpec={boardSpec}
                               gameState={gameState}
                               orderState={this.props.orderState}/>
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList
                        turn={turn}
                        showResolve={orderable && turn == turns.length - 1}
                        showRevert={turn < turns.length - 1 && turn >= this.props.session.turns.length}
                        orders={orders}
                        boardSpec={boardSpec}
                        gameState={gameState}
                        showOrders={this.state.showOrders}
                        orderMode={this.props.orderState.orderMode}
                        toggleShowOrders={()=>{
                            this.setState({showOrders: !this.state.showOrders});
                        }}
                    />
                </div>
            </div>
        );
    }
}
