import React from 'react';

import Board from './board';
import {resolve} from './resolve';
import OrdersList from './orders-list';
import SupplyCenters from './supply-centers';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            turn: props.session.turns.length - 1,
            showOrders: true,
            selectedTerritory: false,
            targetUnitTerritory: false,
            selectionMode: "unit", 
            orderMode: "support",
            additionalOrders: {}
        };
    }
    getCurrentGameState = () => {
        let boardSpec = this.props.session.boardSpec;
        let gameState = JSON.parse(JSON.stringify(boardSpec.startingGameState));
        for (let orders of this.props.session.turns.slice(0, this.state.turn)) {
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
    clickTerritory = (territory) => {
        let gameState = this.getCurrentGameState();
        let orderable = this.props.session.turns[this.state.turn].length === 0;
        if (!orderable) {
            return;
        }
        const units = this.getUnitMap(gameState);
        
        if (this.state.selectionMode === "unit") {
            if (units[territory] !== undefined){
                this.setState({selectedTerritory: territory});
                if (this.state.orderMode === "move") {
                    this.setState({selectionMode: "target"});
                } else {
                    this.setState({selectionMode: "targetUnit"});
                }
            }
        } else if (this.state.selectionMode === "targetUnit") {
            if (units[territory] !== undefined){
                this.setState({targetUnitTerritory: territory, selectionMode: "target"});
            }
        } else if (this.state.selectionMode === "target") {
            this.setState({selectionMode: "unit", selectedTerritory: false});
            if (this.state.orderMode === "move") {
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
            } else if (this.state.orderMode === "convoy") {
                this.state.additionalOrders[this.state.selectedTerritory] ={
                    power: units[this.state.selectedTerritory].faction,
                    unit: this.state.selectedTerritory,
                    action: "Convoy",
                    target: territory,
                    targetUnit: this.state.targetUnitTerritory
                };
                this.setState({additionalOrders: this.state.additionalOrders});
            } else if (this.state.orderMode === "support") {
                if (this.state.targetUnitTerritory === territory) {
                    this.state.additionalOrders[this.state.selectedTerritory] = {
                        power: units[this.state.selectedTerritory].faction,
                        unit: this.state.selectedTerritory,
                        action: "Support",
                        target: null,
                        targetUnit: this.state.targetUnitTerritory,
                    };
                } else {
                    this.state.additionalOrders[this.state.selectedTerritory] = {
                        power: units[this.state.selectedTerritory].faction,
                        unit: this.state.selectedTerritory,
                        action: "Support",
                        target: territory,
                        targetUnit: this.state.targetUnitTerritory,
                    };
                }
                this.setState({additionalOrders: this.state.additionalOrders});
            }
        }
    };
    render () {
        let boardSpec = this.props.session.boardSpec;
        let gameState = this.getCurrentGameState();
        let orders = this.props.session.turns[this.state.turn];
        let orderable = orders.length === 0;
        if (orderable){
            orders = Object.values(this.state.additionalOrders);
        }
        return (
            <div>
                <h1>{this.props.session.title} ({boardSpec.title})</h1>
                <div className="main">
                    <div className="board-container">
                        <Board clickTerritory={this.clickTerritory} orders={this.state.showOrders ? orders : []} boardSpec={boardSpec} gameState={gameState} selectedTerritory={orderable ? this.state.selectedTerritory : false}/>
                        <SupplyCenters boardSpec={boardSpec} gameState={gameState} />
                    </div>
                    <OrdersList
                        orders={orders}
                        boardSpec={boardSpec}
                        gameState={gameState}
                        showOrders={this.state.showOrders}
                        orderMode={this.state.orderMode}
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
                                    this.props.session.turns.length - 1, this.state.turn + 1)
                            });
                        }}/>
                </div>
            </div>
        );
    }
}


module.exports = App;
