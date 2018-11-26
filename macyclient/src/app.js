import React from 'react';

import Board from './board';
import MouseFollower from './mouse-follower';
import {resolve} from './logic/resolve';
import utils from './utils';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';
import Help from './help';
import {SessionWrapper} from './session';


class App extends React.Component {
    constructor(props){
        super(props);
        this.gameStateCache = {};
        this.state = {
            showOrders: true,
            showHelp: false
        };
    }

    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.keyCode === 77) { // m
                this.sw.getOrderBuilder().setMode("Move");
            } else if (e.keyCode === 86) { // v
                this.sw.getOrderBuilder().setMode("Move (Convoy)");
            } else if (e.keyCode === 83) { // s
                this.sw.getOrderBuilder().setMode("Support");
            } else if (e.keyCode === 67) { // c
                this.sw.getOrderBuilder().setMode("Convoy");
            } else if (e.keyCode === 65) { // a
                this.sw.getOrderBuilder().setMode("Build Army");
            } else if (e.keyCode === 70) { // f
                this.sw.getOrderBuilder().setMode("Build Fleet");
            } else if (e.keyCode === 68) { // d
                this.sw.getOrderBuilder().setMode("Disband");
            } else if (e.keyCode === 81) { // q
                this.sw.getOrderBuilder().setMode("Retreat");
            } else if (e.keyCode === 191) { // ?
                this.toggleHelp();
            } else if (e.keyCode === 78) { // n
                this.sw.goForward();
            } else if (e.keyCode === 80) { // p
                this.sw.goBack();
            } else if (e.keyCode === 82) { // r
                this.sw.resolveOrders();
            } else if (e.keyCode === 88) { // x
                this.sw.revertToCurrentTurn();
            } else if (e.keyCode === 79) { // o
                this.loadSession();
            } else if (e.keyCode === 87) { // w
                this.saveSession();
            }
        };
        let gameState = this.sw.computeCurrentGameState();
        let orderModes = utils.getAllowedOrderModes(gameState.season);
        if (!orderModes.includes(this.state.orderMode)) {
            this.sw.getOrderBuilder().setMode(orderModes[0]);
        }
    }

    componentWillMount(){
        this.useSession(this.props.session);
    }

    componentWillReceiveProps(newProps){
        if (newProps.session !== this.props.session) {
            this.useSession(newProps.session);
        }
    }

    componentDidUpdate() {
        let gameState = this.sw.computeCurrentGameState();
        let orderModes = utils.getAllowedOrderModes(gameState.season);
        if (!orderModes.includes(this.state.orderState.orderMode)) {
            this.sw.getOrderBuilder().setMode(orderModes[0]);
        }
    }

    useSession(session) {
        this.sw = new SessionWrapper(session, (state) => {
            this.setState(state);
        });
        this.setState(this.sw.getState());
    }

    toggleHelp = () => {
        this.setState({showHelp: !this.state.showHelp});
    };

    saveSession = ()=>{
        let session_copy = JSON.parse(JSON.stringify(this.props.session));
        session_copy.boardSpec = "<removed to save space>";
        session_copy.turns = session_copy.turns.concat(this.state.turnState.mutableTurns);
        this.props.saveSession(session_copy);
    };

    loadSession = ()=> {
        this.props.loadSession();
    };

    render () {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.sw.computeCurrentGameState();
        let turns = this.sw.getTurns();
        const turn = this.state.turnState.turn;
        let orders = turns[turn];
        let orderable = orders.length === 0;
        if (orderable){
            orders = Object.values(this.state.orderState.orders);
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
                        <Board clickTerritory={this.sw.tapTerritory}
                               orders={this.state.showOrders ? orders : []}
                               boardSpec={boardSpec}
                               gameState={gameState}
                               orderState={this.state.orderState}/>
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList
                        showResolve={orderable && turn == turns.length - 1}
                        showRevert={turn < turns.length - 1 && turn >= this.props.session.turns.length}
                        orders={orders}
                        boardSpec={boardSpec}
                        gameState={gameState}
                        showOrders={this.state.showOrders}
                        orderMode={this.state.orderState.orderMode}
                        resolveOrders={this.sw.resolveOrders}
                        revertOrders={this.sw.revertToCurrentTurn}
                        setOrderMode={this.sw.getOrderBuilder().setMode}
                        toggleShowOrders={()=>{
                            this.setState({showOrders: !this.state.showOrders});
                        }}
                        goBack={this.sw.goBack}
                        goForward={this.sw.goForward}/>
                </div>
            </div>
        );
    }
}


module.exports = App;
