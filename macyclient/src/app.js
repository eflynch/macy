import React from 'react';

import Board from './board';
import MouseFollower from './mouse-follower';
import {resolve} from './logic/resolve';
import utils from './utils';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';
import Help from './help';


class App extends React.Component {
    constructor(props){
        super(props);
        this.gameStateCache = {};
        this.state = {
            turn: props.session.turns.length,
            showOrders: true,
            selectedTerritory: false,
            selectedTargetUnit: false,
            selectionMode: "unit", 
            orderMode: "Move",
            showHelp: false,
            additionalOrders: {},
            additionalTurns: [[]]
        };
    }
    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.keyCode === 77) { // m
                this.setState({orderMode: "Move"});
            } else if (e.keyCode === 86) { // v
                this.setState({orderMode: "Move (Convoy)"});
            } else if (e.keyCode === 83) { // s
                this.setState({orderMode: "Support"});
            } else if (e.keyCode === 67) { // c
                this.setState({orderMode: "Convoy"});
            } else if (e.keyCode === 65) { // a
                this.setState({orderMode: "Build Army"});
            } else if (e.keyCode === 70) { // f
                this.setState({orderMode: "Build Fleet"});
            } else if (e.keyCode === 68) { // d
                this.setState({orderMode: "Disband"});
            } else if (e.keyCode === 81) { // q
                this.setState({orderMode: "Retreat"});
            } else if (e.keyCode === 191) { // ?
                this.toggleHelp();
            } else if (e.keyCode === 78) { // n
                this.goForward();
            } else if (e.keyCode === 80) { // p
                this.goBack();
            } else if (e.keyCode === 82) { // r
                this.resolveOrders();
            } else if (e.keyCode === 88) { // x
                this.revertToCurrentTurn();
            } else if (e.keyCode === 79) { // o
                this.loadSession();
            } else if (e.keyCode === 87) { // w
                this.saveSession();
            }
        };
        let gameState = this.getCurrentGameState();
        let orderModes = utils.getAllowedOrderModes(gameState.season);
        if (!orderModes.includes(this.state.orderMode)) {
            this.setState({orderMode: orderModes[0]});
        }
    }
    componentDidUpdate() {
        let gameState = this.getCurrentGameState();
        let orderModes = utils.getAllowedOrderModes(gameState.season);
        if (!orderModes.includes(this.state.orderMode)) {
            this.setState({orderMode: orderModes[0]});
        }
    }
    toggleHelp = () => {
        this.setState({showHelp: !this.state.showHelp});
    };
    getCurrentGameState = () => {
        if (this.gameStateCache[this.state.turn] === undefined) {
            console.log("Cache miss", this.state.turn);
            let boardSpec = this.props.session.boardSpec;
            let gameState = JSON.parse(JSON.stringify(boardSpec.startingGameState));
            let turns = this.props.session.turns.concat(this.state.additionalTurns);
            for (let orders of turns.slice(0, this.state.turn)) {
                gameState = resolve(boardSpec, gameState, orders);
            }
            this.gameStateCache[this.state.turn] = gameState;
        }
        return this.gameStateCache[this.state.turn];
    };
    setOrderMode = (orderMode) => {
        let gameState = this.getCurrentGameState();
        let orderModes = utils.getAllowedOrderModes(gameState.season);
        if (orderModes.includes(orderMode)) {
            this.setState({orderMode: orderMode});
        } else {
            this.setState({orderMode: orderModes[0]});
        }
    };

    setTurn = (turn) => {
        this.setState({turn: turn});
    };

    goBack = () => {
        this.setTurn(Math.max(0, this.state.turn - 1));
    };

    goForward = () => {
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        this.setTurn(Math.min(turns.length - 1, this.state.turn + 1));
    };

    revertToCurrentTurn = () => {
        if (this.state.turn < this.props.session.turns.length){
            return;
        }
        const newLastAdditionalTurn = this.state.turn - this.props.session.turns.length;
        // TODO:: Do this immutable instead
        this.state.additionalTurns.length = newLastAdditionalTurn + 1;
        let theseOrders = this.state.additionalTurns[newLastAdditionalTurn];
        let additionalOrders = {}
        for (let order of theseOrders) {
            additionalOrders[order.unit] = order;
        }
        theseOrders.length = 0;

        // Invalidate cache for all turns after and including this.state.turn
        for (let cacheTurn of Object.keys(this.gameStateCache)) {
            if (cacheTurn >= this.state.turn){
                this.gameStateCache[cacheTurn] = undefined;
            }
        }
        this.setState({
            additionalOrders: additionalOrders,
            additionalTurns: this.state.additionalTurns,
        });
    };

    resolveOrders = () => {
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        let orders = turns[this.state.turn];
        let orderable = orders.length === 0;
        if (orderable){
            orders = Object.values(this.state.additionalOrders);
        }
        if (!orderable || this.state.turn != turns.length - 1){
            return;
        }

        let turnToModify = this.state.additionalTurns.length - 1;

        // TODO:: DO this immutably instead
        this.state.additionalTurns[turnToModify].push(...orders);
        this.state.additionalTurns.push([]);

        // Invalidate modified turn
        this.gameStateCache[turnToModify] = undefined;
        this.setState({
            additionalOrders: {},
            additionalTurns: this.state.additionalTurns,
        });
        this.setTurn(this.state.turn + 1);
    };

    clickTerritory = (territory) => {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.getCurrentGameState();
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        let orderable = turns[this.state.turn].length === 0;
        if (!orderable) {
            return;
        }
        const units = utils.getUnitMap(gameState);
        const buildPoints = utils.getBuildPoints(boardSpec);

        let setUnit = (territory) => {
            switch (this.state.orderMode) {
            case "Convoy":
                if (units[territory] !== undefined && units[territory].unitType === "fleet") {
                    this.setState({selectedTerritory: territory});
                }
                break;
            case "Move":
            case "Move (Convoy)":
            case "Support":
                if (units[territory] !== undefined) {
                    this.setState({selectedTerritory: territory});
                }
                break;
            case "Retreat":
                this.setState({selectedTerritory: territory});
                break;
            }
        };

        let setTargetUnit = (territory) => {
            switch (this.state.orderMode) {
            case "Convoy":
                if (units[territory] !== undefined){
                    if (units[territory].unitType === "army") {
                        this.setState({selectedTargetUnit: territory});
                    }
                }
                break;
            case "Support":
                if (units[territory] !== undefined) {
                    this.setState({selectedTargetUnit: territory});
                }
                break;
            }
        };

        let setOrder = (territory) => {
            let setOrderState = (target, faction) => {
                let order = utils.makeOrder(
                    faction, this.state.selectedTerritory,
                    this.state.selectedTargetUnit, territory, this.state.orderMode);
                this.state.additionalOrders[target] = order;

                this.setState({
                    additionalOrders: this.state.additionalOrders,
                    selectedTargetUnit: false,
                    selectedTerritory: false
                });
            };

            switch (this.state.orderMode) {
            case "Convoy":
            case "Move":
            case "Move (Convoy)":
            case "Support":
                let faction = units[this.state.selectedTerritory].faction;
                setOrderState(this.state.selectedTerritory, faction);
                break;
            case "Retreat":
                if (this.state.selectedTerritory !== territory) {
                    let faction = false;
                    for (let dislodgement of gameState.dislodged) {
                        if (dislodgement.source === this.state.selectedTerritory) {
                            faction = dislodgement.faction;
                            break;
                        }
                    }
                    setOrderState(this.state.selectedTerritory, faction);
                }
                break;
            case "Build Army":
            case "Build Fleet":
                if (units[territory] === undefined) {
                    let faction = buildPoints[territory].faction;
                    setOrderState(territory, faction);
                }
                break;
            case "Disband":
                if (gameState.season.includes("Retreat")) {
                    let faction = false;
                    for (let dislodgement of gameState.dislodged) {
                        if (dislodgement.source === territory) {
                            faction = dislodgement.faction;
                            break;
                        }
                    }
                    setOrderState(territory, faction);
                } else {
                    if (units[territory] !== undefined) {
                        let faction = units[territory].faction;
                        setOrderState(territory, faction);
                    }
                }
                
                break;
            }
        };


        switch (this.state.orderMode) {
        case "Convoy":
        case "Support":
            if (!this.state.selectedTerritory){
                setUnit(territory);
            } else if (!this.state.selectedTargetUnit) {
                setTargetUnit(territory);
            } else {
                setOrder(territory);
            }
            break;
        case "Move":
        case "Move (Convoy)":
        case "Retreat":
            if (!this.state.selectedTerritory){
                setUnit(territory);
            } else {
                setOrder(territory);
            }
            break;
        case "Build Fleet":
        case "Build Army":
        case "Disband":
            setOrder(territory);
            break;
        }
    };

    saveSession = ()=>{
        let session_copy = JSON.parse(JSON.stringify(this.props.session));
        session_copy.boardSpec = "<removed to save space>";
        session_copy.turns = session_copy.turns.concat(this.state.additionalTurns);
        this.props.saveSession(session_copy);
    };

    loadSession = ()=> {
        this.props.loadSession();
    };

    render () {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.getCurrentGameState();
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        let orders = turns[this.state.turn];
        let orderable = orders.length === 0;
        if (orderable){
            orders = Object.values(this.state.additionalOrders);
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
                        <Board clickTerritory={this.clickTerritory}
                               orders={this.state.showOrders ? orders : []}
                               boardSpec={boardSpec}
                               gameState={gameState}
                               orderMode={this.state.orderMode}
                               selectedTerritory={orderable ? this.state.selectedTerritory : false}
                               selectedTargetUnit={this.state.selectedTargetUnit} />
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList
                        showResolve={orderable && this.state.turn == turns.length - 1}
                        showRevert={this.state.turn < turns.length - 1 && this.state.turn >= this.props.session.turns.length}
                        orders={orders}
                        boardSpec={boardSpec}
                        gameState={gameState}
                        showOrders={this.state.showOrders}
                        orderMode={this.state.orderMode}
                        resolveOrders={this.resolveOrders}
                        revertOrders={this.revertToCurrentTurn}
                        setOrderMode={this.setOrderMode}
                        toggleShowOrders={()=>{
                            this.setState({showOrders: !this.state.showOrders});
                        }}
                        goBack={this.goBack}
                        goForward={this.goForward}/>
                </div>
            </div>
        );
    }
}


module.exports = App;
