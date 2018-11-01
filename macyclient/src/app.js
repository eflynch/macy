import React from 'react';

import Board from './board';
import {resolve} from './resolve';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            turn: props.session.turns.length,
            showOrders: true,
            selectedTerritory: false,
            targetUnitTerritory: false,
            selectionMode: "unit", 
            orderMode: "move",
            additionalOrders: {},
            additionalTurns: [[]]
        };
    }
    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.keyCode === 77) {
                this.setState({orderMode: "move"});
            } else if (e.keyCode === 83) {
                this.setState({orderMode: "support"});
            } else if (e.keyCode === 67) {
                this.setState({orderMode: "convoy"});
            } else if (e.keyCode === 65) {
                this.setState({orderMode: "build army"});
            } else if (e.keyCode === 70) {
                this.setState({orderMode: "build fleet"});
            } else if (e.keyCode === 68) {
                this.setState({orderMode: "disband"});
            }
        };
    }
    getCurrentGameState = () => {
        let boardSpec = this.props.session.boardSpec;
        let gameState = JSON.parse(JSON.stringify(boardSpec.startingGameState));
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        for (let orders of turns.slice(0, this.state.turn)) {
            gameState = resolve(boardSpec, gameState, orders);
        }
        return gameState;
    };
    getUnitMap = (gameState) => {
        const factions = Object.keys(gameState.factions);
        const unitTypes = ["army", "fleet"];
        let units = {};
        for (let faction of factions) {
            for (let unitType of unitTypes) {
                for (let territory of gameState.factions[faction][unitType]) {
                    units[territory] = {
                        faction: faction,
                        unitType: unitType
                    };
                }
            }
        }
        return units;
    };
    getBuildPoints = (boardSpec) => {
        const factions = Object.keys(boardSpec.factions);
        let buildPoints = {};
        for (let faction of factions) {
            for (let territory of boardSpec.factions[faction].buildPoints) {
                buildPoints[territory] = {
                    power: faction
                };
            }
            for (let territory of boardSpec.factions[faction].emergencyBuildPoints) {
                buildPoints[territory] = {
                    power: faction
                };
            }
        }
        return buildPoints;
    };
    clickTerritory = (territory) => {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.getCurrentGameState();
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        let orderable = turns[this.state.turn].length === 0;
        if (!orderable) {
            return;
        }
        const units = this.getUnitMap(gameState);
        const buildPoints = this.getBuildPoints(boardSpec);
        
        if (this.state.orderMode === "convoy") {
            if (this.state.selectedTerritory) {
                if (this.state.selectedTargetUnit) {
                    this.state.additionalOrders[this.state.selectedTerritory] ={
                        power: units[this.state.selectedTerritory].faction,
                        unit: this.state.selectedTerritory,
                        action: "Convoy",
                        target: territory,
                        targetUnit: this.state.selectedTargetUnit
                    };
                    this.setState({additionalOrders: this.state.additionalOrders});
                    this.setState({selectedTargetUnit: false, selectedTerritory: false});
                } else {
                    if (units[territory] !== undefined){
                        if (units[territory].unitType === "army") {
                            this.setState({selectedTargetUnit: territory});
                        }
                    }
                }
            } else {
                if (units[territory] !== undefined) {
                    if (units[territory].unitType === "fleet"){
                        this.setState({selectedTerritory: territory});
                    }
                }
            }
        } else if (this.state.orderMode === "support") {
            if (this.state.selectedTerritory) {
                if (this.state.selectedTargetUnit) {
                    if (this.state.selectedTargetUnit === territory) {
                        this.state.additionalOrders[this.state.selectedTerritory] = {
                            power: units[this.state.selectedTerritory].faction,
                            unit: this.state.selectedTerritory,
                            action: "Support",
                            target: null,
                            targetUnit: this.state.selectedTargetUnit,
                        };
                    } else {
                        this.state.additionalOrders[this.state.selectedTerritory] = {
                            power: units[this.state.selectedTerritory].faction,
                            unit: this.state.selectedTerritory,
                            action: "Support",
                            target: territory,
                            targetUnit: this.state.selectedTargetUnit,
                        };
                    }
                    this.setState({additionalOrders: this.state.additionalOrders});
                    this.setState({selectedTargetUnit: false, selectedTerritory: false});
                } else {
                    if (units[territory] !== undefined){
                        this.setState({selectedTargetUnit: territory});
                    }
                }
            } else {
                if (units[territory] !== undefined) {
                    this.setState({selectedTerritory: territory});
                }
            }
        } else if (this.state.orderMode === "move") {
            if (this.state.selectedTerritory) {
                if (this.state.selectedTerritory === territory) {
                    this.state.additionalOrders[this.state.selectedTerritory] = {
                        power: units[this.state.selectedTerritory].faction,
                        unit: this.state.selectedTerritory,
                        action: "Hold",
                        target: territory,
                    };
                } else {
                    this.state.additionalOrders[this.state.selectedTerritory] = {
                        power: units[this.state.selectedTerritory].faction,
                        unit: this.state.selectedTerritory,
                        action: "Move",
                        target: territory,
                        viaConvoy: false
                    };
                }
                this.setState({additionalOrders: this.state.additionalOrders});
                this.setState({selectedTargetUnit: false, selectedTerritory: false});
            } else {
                if (units[territory] !== undefined) {
                    this.setState({selectedTerritory: territory});
                }
            }
        } else if (this.state.orderMode === "build army") {
            if (units[territory] === undefined) {
                this.state.additionalOrders[territory] = {
                    power: buildPoints[territory].power,
                    unitType: "army",
                    action: "Build",
                    unit: territory
                };
                this.setState({additionalOrders: this.state.additionalOrders});
                this.setState({selectedTargetUnit: false, selectedTerritory: false});
            }
        } else if (this.state.orderMode === "build fleet") {
            if (units[territory] === undefined) {
                this.state.additionalOrders[territory] = {
                    power: buildPoints[territory].power,
                    unitType: "fleet",
                    action: "Build",
                    unit: territory
                };
                this.setState({additionalOrders: this.state.additionalOrders});
                this.setState({selectedTargetUnit: false, selectedTerritory: false});
            }
        } else if (this.state.orderMode === "disband") {
            if (units[territory] !== undefined) {
                this.state.additionalOrders[territory] = {
                    power: units[territory].faction,
                    action: "Disband",
                    unit: territory
                };
                this.setState({additionalOrders: this.state.additionalOrders});
                this.setState({selectedTargetUnit: false, selectedTerritory: false});
            }
        }
    };
    render () {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.getCurrentGameState();
        let turns = this.props.session.turns.concat(this.state.additionalTurns);
        console.log(turns, this.state.turn);
        let orders = turns[this.state.turn];
        let orderable = orders.length === 0;
        if (orderable){
            orders = Object.values(this.state.additionalOrders);
        }
        return (
            <div>
                <h1>{this.props.session.title} ({boardSpec.title})</h1>
                <p className="saveload">
                    <a onClick={(e)=>{
                        let session_copy = JSON.parse(JSON.stringify(this.props.session));
                        session_copy.boardSpec = "<removed to save space>";
                        session_copy.turns = session_copy.turns.concat(this.state.additionalTurns);
                        this.props.saveSession(session_copy);
                    }}>save session to clipboard</a>
                    <a onClick={(e)=>{
                        this.props.loadSession();
                    }}>load session from clipboard</a>
                </p>
                <div className="main">
                    <div className="board-container">
                        <Board clickTerritory={this.clickTerritory} orders={this.state.showOrders ? orders : []} boardSpec={boardSpec} gameState={gameState} selectedTerritory={orderable ? this.state.selectedTerritory : false}/>
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList
                        showResolve={orderable && this.state.turn == turns.length - 1}
                        orders={orders}
                        boardSpec={boardSpec}
                        gameState={gameState}
                        showOrders={this.state.showOrders}
                        orderMode={this.state.orderMode}
                        resolveOrders={()=>{
                            this.state.additionalTurns[this.state.additionalTurns.length - 1].push(...orders);
                            this.state.additionalTurns.push([]);
                            this.setState({
                                additionalOrders: {},
                                additionalTurns: this.state.additionalTurns,
                                turn: this.state.turn + 1
                            });
                        }}
                        setOrderMode={(orderMode)=>{
                            this.setState({orderMode: orderMode});
                        }}
                        toggleShowOrders={()=>{
                            this.setState({showOrders: !this.state.showOrders});
                        }}
                        goBack={()=>{
                            this.setState({turn: Math.max(0, this.state.turn -1)});
                        }}
                        goForward={()=>{
                            this.setState({
                                turn: Math.min(
                                    turns.length - 1, this.state.turn + 1)
                            });
                        }}/>
                </div>
            </div>
        );
    }
}


module.exports = App;
