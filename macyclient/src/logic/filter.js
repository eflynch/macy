import {removeFromArray, stripCoast} from '../utils';

// remove any extra orders given to units
let ignoreExtraOrders = (orders) => {
    let orderedUnits = new Set();
    let toRemove = [];
    for (let order of orders) {
        if (orderedUnits.has(order.unit)) {
            toRemove.push(order);
        } else {
            orderedUnits.add(order.unit);
        }
    }
    for (let order of toRemove) {
        removeFromArray(orders, order);
    }
};

// removes orders that are malformed (not orders that FAIL)
let filterInvalidOrders = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);

    let validOrders = orders.filter((order) => {
        if (order.action === "Retreat") {
            let thisDislodgement = false;
            for (let dislodgement of gameState.dislodged) {
                if (dislodgement.source === order.unit && dislodgement.faction === order.faction) {
                    thisDislodgement = dislodgement;
                    if (order.target === dislodgement.restriction){
                        console.warn("invalid retreat", order);
                        return false;
                    }
                }
            }
            if (!thisDislodgement){
                console.warn("Invalid retreat", order);
                return false;
            }
            for (let faction of factions) {
                for (let unit of gameState.factions[faction][thisDislodgement.unitType]) {
                    if (stripCoast(unit) === stripCoast(order.target)) {
                        console.warn("Invalid retreat", order);
                        return false;
                    }
                }
            }
            if (boardSpec.graph[thisDislodgement.unitType].distance(order.unit, order.target) != 1) {
                console.warn("Invalid retreat", order);
                return false;
            }
            if (gameState.retreatRestrictions.includes(order.target)){
                console.warn("Invalid retreat", order);
                return false;
            }
            order.unitType = thisDislodgement.unitType;
        } else if (order.action === "Build") {

        } else if (order.action === "Disband") {

        } else {
            let unitType;
            if (gameState.factions[order.faction].army.includes(order.unit)) {
                unitType = "army";
            } else if (gameState.factions[order.faction].fleet.includes(order.unit)) {
                unitType = "fleet";
            } else {
                console.warn("Not a real unit", order);
                return false;
            }

            if (order.action === "Move") {
                if (!order.viaConvoy && boardSpec.graph[unitType].distance(order.unit, order.target) != 1) {
                    console.warn("Invalid move", order);
                    console.warn(boardSpec.graph.fleet);
                    return false;
                }
            } else if (order.action === "Support") {
                let strippedTarget = stripCoast(order.target);
                let allowedTargets = [strippedTarget];
                if (boardSpec.multiCoast[strippedTarget] !== undefined) {
                    for (let coast of boardSpec.multiCoast[strippedTarget]) {
                        allowedTargets.push(`${strippedTarget} :: ${coast}`);
                    }
                }
                let foundOne = false;
                for (let target of allowedTargets) {
                    if (boardSpec.graph[unitType].distance(order.unit, target) == 1) {
                        foundOne = true;
                        break;
                    }
                }
                if (!foundOne){
                    console.warn("Invalid support", order, "allowed targets", allowedTargets);
                    return false;
                }
            } else if (order.action === "Convoy") {
                if (unitType !== "fleet") {
                    return false;
                }
                if (!boardSpec.canConvoy.includes(order.unit)) {
                    return false;
                }
            }
        }
        
        return true;
    });

    ignoreExtraOrders(validOrders);
    return validOrders;
};


module.exports = {
    filterInvalidOrders: filterInvalidOrders
};

