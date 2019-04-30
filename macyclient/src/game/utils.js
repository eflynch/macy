
export const removeFromArray = (array, item) => {
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
};

export const stripCoast = (fleet) => {
    return fleet.split(" :: ")[0];
};

export const getAllowedOrderModes = (season) => {
    let orderModes = [];
    if (season === "Spring" || season === "Fall"){
        orderModes = ["Move", "Move (Convoy)", "Support", "Convoy"];
    } else if (season === "Winter") {
        orderModes = ["Build Army", "Build Fleet", "Disband"];
    } else if (season.includes("Retreat")) {
        orderModes = ["Retreat", "Disband"];
    }
    return orderModes;
};

export const getUnitMap = (gameState) => {
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

export const getBuildPoints = (boardSpec) => {
    const factions = Object.keys(boardSpec.factions);
    let buildPoints = {};
    for (let faction of factions) {
        for (let territory of boardSpec.factions[faction].armyBuildPoints) {
            buildPoints[territory] = {
                faction: faction
            };
        }
        for (let territory of boardSpec.factions[faction].emergencyBuildPoints) {
            buildPoints[territory] = {
                faction: faction
            };
        }
    }
    return buildPoints;
};

export const getTerritories = (boardSpec, gameState, filterType) => {
    const factions = Object.keys(gameState.factions);
    let all_territories = Object.keys(boardSpec.unitPositions);
    if (filterType === "Show Coasts") {
        return all_territories.filter(t => !boardSpec.multiCoast[t]);
    } else if (filterType === "Hide Coasts") {
        return all_territories.filter(t => !t.includes("::"));
    } else if (filterType === "Show Coasts with Fleets Only") {
        return all_territories.filter(t => {
            if (t.includes("::")) {
                for (let faction of factions) {
                    if (gameState.factions[faction].fleet.includes(t)) {
                        return true;
                    }
                }
                return false;
            } else if (boardSpec.multiCoast[t]) {
                for (let faction of factions) {
                    for (let territory of gameState.factions[faction].fleet) {
                        if (territory.includes(t)){
                            return false;
                        }
                    }
                }
                return true;
            }
            return true;
        });
    } else {
        console.warn("You made a mistake boy");
    }
};

export const getTappableTerritories = (boardSpec, gameState, orderState) => {
    const factions = Object.keys(gameState.factions);
    const units = getUnitMap(gameState);
    let fleetSelected = units[orderState.unit] && units[orderState.unit].unitType === "fleet";
    let armySelected = units[orderState.unit] && units[orderState.unit].unitType === "army";

    if (gameState.season.includes("Retreat")) {
        let all_territories = Object.keys(boardSpec.unitPositions);
        let fleetRetreatSelected = false;
        let armyRetreatSelected = false;
        if (orderState.unit) {
            for (let dislodgement of gameState.dislodged) {
                if (orderState.unit === dislodgement.source) {
                    return all_territories.filter(t => {
                        if (units[t] !== undefined) {
                            return false;
                        }
                        if (boardSpec.graph[dislodgement.unitType].distance(t, dislodgement.source) <= 1 && t !== dislodgement.restriction){
                            return true;
                        }
                        return false;
                    });
                }
            }
        } else {
            return all_territories.filter(t => {
                for (let dislodgement of gameState.dislodged){
                    if (dislodgement.source === t){
                        return true;
                    }
                }
                return false;
            });
        }
    } else if (orderState.orderMode === "Move" || orderState.orderMode === "Move (Convoy)") {
        if (armySelected){
            return getTerritories(boardSpec, gameState, "Hide Coasts");
        } else if (fleetSelected) {
            return getTerritories(boardSpec, gameState, "Show Coasts");
        } else {
            return Object.keys(boardSpec.unitPositions).filter((t) => {
                return units[t] !== undefined;
            });
        }
    } else if (orderState.orderMode === "Support") {
        let targetUnitFleetSelected = units[orderState.targetUnit] && units[orderState.targetUnit].unitType === "fleet";
        let targetUnitArmySelected = units[orderState.targetUnit] && units[orderState.targetUnit].unitType === "army";
        if (armySelected || targetUnitArmySelected) {
            return getTerritories(boardSpec, gameState, "Hide Coasts");
        } else if (fleetSelected) {
            if (targetUnitFleetSelected) {
                return getTerritories(boardSpec, gameState, "Show Coasts");
            } else {
                return Object.keys(boardSpec.unitPositions).filter((t) => {
                    return units[t] !== undefined;
                });
            }
        } else {
            return getTerritories(boardSpec, gameState, "Show Coasts with Fleets Only");
        }
    } else if (orderState.orderMode === "Convoy") {
        if (fleetSelected) {
            return getTerritories(boardSpec, gameState, "Hide Coasts");
        } else {
            return getTerritories(boardSpec, gameState, "Show Coasts with Fleets Only");
        }
    } else if (orderState.orderMode === "Disband") {
        let all_territories = Object.keys(boardSpec.unitPositions);
        return all_territories.filter((t) => {
            return units[t] !== undefined;
        });
    } else if (orderState.orderMode === "Build Fleet") {
        let all_territories = Object.keys(boardSpec.unitPositions);
        return all_territories.filter((t) => {
            if (units[t] !== undefined || units[stripCoast(t)] !== undefined){
                return false;
            }
            for (let faction of factions) {
                if (boardSpec.factions[faction].fleetBuildPoints.includes(t)){
                    return true;
                }
            }
            return false;
        });
    } else if (orderState.orderMode === "Build Army") {
        let all_territories = Object.keys(boardSpec.unitPositions);
        return all_territories.filter((t) => {
            if (units[t] !== undefined){
                return false;
            }
            for (let faction of factions) {
                if (boardSpec.factions[faction].armyBuildPoints.includes(t)){
                    return true;
                }
            }
            return false;
        });
    } else {
        return getTerritories(boardSpec, gameState, "Show Coasts with Fleets Only");
    }
};

export const makeOrder = (faction, unit, targetUnit, target, orderMode) => {
    switch(orderMode){
    case "Convoy":
        return {
            faction: faction,
            unit: unit,
            action: "Convoy",
            target: target,
            targetUnit: targetUnit 
        };
    case "Move":
    case "Move (Convoy)":
        if (unit === target) {
            return {
                faction: faction,
                unit: unit,
                action: "Hold",
                target: target,
            };
        } else {
            return {
                faction: faction,
                unit: unit,
                action: "Move",
                target: target,
                viaConvoy: orderMode === "Move (Convoy)" 
            };
        }
    case "Support":
        return {
            faction: faction,
            unit: unit,
            action: "Support",
            target: target,
            targetUnit: targetUnit,
        };
    case "Retreat":
        return {
            faction: faction,
            unit: unit,
            action: "Retreat",
            target:target 
        };
    case "Build Army":
        return {
            faction: faction,
            unitType: "army",
            action: "Build",
            unit: target 
        };
    case "Build Fleet":
        return {
            faction: faction,
            unitType: "fleet",
            action: "Build",
            unit: target 
        };
    case "Disband":
        return {
            faction: faction,
            action: "Disband",
            unit: target 
        };
    }
};

export const formatOrder = (order) => {
    let unit = order.unit ? order.unit.toLowerCase(): "_";
    let target = order.target ? order.target.toLowerCase() : "_";
    let targetUnit = order.targetUnit ? order.targetUnit.toLowerCase() : "_";
    if (order.action === "Move") {
        if (order.viaConvoy){
            return `${unit} ⤼ ${target}`;
        }
        return `${unit} → ${target}`;
    }

    if (order.action === "Support") {
        if (target !== targetUnit) {
            return `${unit} S ${targetUnit} → ${target}`;
        } else {
            return `${unit} S ${targetUnit} H`;
        }
    }

    if (order.action === "Hold") {
        return `${unit} H`;
    }

    if (order.action === "Convoy") {
        return `${unit} C ${targetUnit} → ${target}`;
    }

    if (order.action === "Build") {
        return `build ${order.unitType} ${order.unit}`;
    }

    if (order.action === "Disband") {
        return `disband ${unit}`;
    }

    if (order.action === "Retreat") {
        return `retreat ${unit} → ${target}`;
    }
};

export default {
    removeFromArray,
    stripCoast,
    getAllowedOrderModes,
    getUnitMap,
    getBuildPoints,
    getTerritories,
    getTappableTerritories,
    makeOrder,
    formatOrder
};
