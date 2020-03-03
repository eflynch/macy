import update from 'immutability-helper';  

import utils from './game/utils';

export class ImmutableUndoState {
    constructor(maxUndo, initialState, onMutate) {
        this.maxUndo = maxUndo;
        this.state = initialState;
        this.undos = [initialState];
        this.redos = [];
        if (onMutate){
            this.onMutate = onMutate;
        } else {
            this.onMutate = (newState)=>{};
        }
    }

    getState = () => { return this.state; }

    update = (hash) => {
        const newState = update(this.state, hash);
        if (this.undos.length > this.maxUndo) {
            this.undos.pop();
        }
        this.undos.unshift(this.state);
        this.redos = [];
        this.state = newState;
        this.onMutate(newState);
    }

    undo = () => {
        if (this.undos.length){
            if (this.redos.length > this.maxUndo) {
                this.redos.pop();
            }
            this.redos.unshift(this.state);
            const newState = this.undos.shift();
            this.onMutate(newState);
            this.state = newState;
        }
    }

    redo = () => {
        if (this.redos.length){
            const newState = this.redos.shift();
            this.onMutate(newState);
            if (this.undos.length > this.maxUndo) {
                this.undos.pop();
            }
            this.undos.unshift(this.state);
            this.state = newState;
        }
    }
}

export class OrderBuilder {
    static makeEmpty(){
        return {
            unit: false,
            targetUnit: false,
            orderMode: "Move",
            orders: {}
        };
    }

    constructor(onMutate) {
        this.ius = new ImmutableUndoState(10, OrderBuilder.makeEmpty(), onMutate);
    }

    undo = () => { return this.ius.undo(); }
    redo = () => { return this.ius.redo(); }
    getState = () => { return this.ius.getState(); }

    loadOrders = (orders) => {
        const orderMap = {};
        for (let order of orders){
            orderMap[order.unit] = order;
        }
        this.ius.update({orders: {$set: orderMap}});
    }

    clearOrders = () => {
        this.ius.update({orders: {$set: {}}});
    }

    setMode = (mode) => {
        this.ius.update({
            orderMode: {$set: mode}
        });
    }

    selectNone = () => {
        this.ius.update({
            unit: {$set: undefined},
            targetUnit: {$set: undefined},
        });
    }

    setUnit = (territory) => {
        this.ius.update({unit: {$set: territory}});
    };

    setTargetUnit = (territory) => {
        this.ius.update({targetUnit: {$set: territory}});
    };

    orderUnit = (faction, unit, targetUnit, target, orderMode) => {
        const order = utils.makeOrder(
            faction, unit, targetUnit, target, orderMode)
        this.ius.update({
            orders : {
                [unit]: {$set: order}
            },
            unit: {$set: undefined},
            targetUnit: {$set: undefined}
        });
    }

    deleteOrder = (unit) => {
        this.ius.update({
            orders : {
                $unset : [unit]
            },
            unit: {$set: undefined},
            targetUnit: {$set: undefined}
        });
    }

    completeOrder = (territory, gameState, boardSpec) => {
        const state = this.getState();
        const units = utils.getUnitMap(gameState);
        const buildPoints = utils.getBuildPoints(boardSpec); 
        switch (state.orderMode) {
        case "Convoy":
        case "Move":
        case "Move (Convoy)":
        case "Support":
            let faction = units[state.unit].faction;
            this.orderUnit(faction, state.unit, state.targetUnit, territory, state.orderMode);
            break;
        case "Retreat":
            if (state.unit !== territory) {
                let faction = false;
                for (let dislodgement of gameState.dislodged) {
                    if (dislodgement.source === state.unit) {
                        faction = dislodgement.faction;
                        break;
                    }
                }
                this.orderUnit(faction, state.unit, state.targetUnit, territory, state.orderMode);
            }
            break;
        case "Build Army":
        case "Build Fleet": {
            let existingOrder = state.orders[territory];
            if (existingOrder !== undefined && existingOrder.action === "Build") {
                this.deleteOrder(territory);
                break;
            }
            if (units[territory] === undefined) {
                let faction = buildPoints[territory].faction;
                this.orderUnit(faction, territory, false, territory, state.orderMode);
            }
            break;
        }
        case "Disband": {
            let existingOrder = state.orders[territory];
            if (existingOrder !== undefined && existingOrder.action === "Disband") {
                deleteOrder(territory);
                break;
            }
            if (gameState.season.includes("Retreat")) {
                let faction = false;
                for (let dislodgement of gameState.dislodged) {
                    if (dislodgement.source === territory) {
                        faction = dislodgement.faction;
                        break;
                    }
                }
                this.orderUnit(faction, territory, state.targetUnit, territory, state.orderMode);
            } else {
                if (units[territory] !== undefined) {
                    let faction = units[territory].faction;
                    this.orderUnit(faction, territory, false, territory, state.orderMode);
                }
            }
            
            break;
        }
        }
    }

    tapTerritory = (territory, gameState, boardSpec) => {
        if (territory === undefined) {
            this.selectNone();
            return;
        }
        const state = this.getState();
        switch (state.orderMode) {
        case "Convoy":
        case "Support":
            if (!state.unit){
                this.setUnit(territory);
            } else if (!state.targetUnit) {
                this.setTargetUnit(territory);
            } else {
                this.completeOrder(territory, gameState, boardSpec);
            }
            break;
        case "Move":
        case "Move (Convoy)":
        case "Retreat":
            if (!state.unit){
                this.setUnit(territory);
            } else {
                this.completeOrder(territory, gameState, boardSpec);
            }
            break;
        case "Build Fleet":
        case "Build Army":
        case "Disband":
           this.completeOrder(territory, gameState, boardSpec);
            break;
        }
    }
}
