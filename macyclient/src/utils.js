        

module.exports = {
    stripCoast: (fleet) => {
        return fleet
            .replace(" :: NC", "")
            .replace(" :: SC", "")
            .replace(" :: WC", "")
            .replace(" :: EC", "");
    },
    getAllowedOrderModes: (season) => {
        let orderModes = [];
        if (season === "Spring" || season === "Fall"){
            orderModes = ["Move", "Move (Convoy)", "Support", "Convoy"];
        } else if (season === "Winter") {
            orderModes = ["Build Army", "Build Fleet", "Disband"];
        } else if (season.includes("Retreat")) {
            orderModes = ["Retreat", "Disband"];
        }
        return orderModes;
    },
    getUnitMap: (gameState) => {
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
    },
    getBuildPoints: (boardSpec) => {
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
    },
    getTerritories: (boardSpec, gameState, filterType) => {
        const factions = Object.keys(gameState.factions);
        let all_territories = Object.keys(boardSpec.unitPositions);
        if (filterType === "Show Coasts") {
            return all_territories.filter(t => !boardSpec.multiCoast.includes(t));
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
                } else if (boardSpec.multiCoast.includes(t)) {
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
    },
    makeOrder: (faction, selectedTerritory, targetUnit, target, orderMode) => {
        switch(orderMode){
        case "Convoy":
            return {
                faction: faction,
                unit: selectedTerritory,
                action: "Convoy",
                target: target,
                targetUnit: targetUnit 
            };
        case "Move":
        case "Move (Convoy)":
            if (selectedTerritory === target) {
                return {
                    faction: faction,
                    unit: selectedTerritory,
                    action: "Hold",
                    target: target,
                };
            } else {
                return {
                    faction: faction,
                    unit: selectedTerritory,
                    action: "Move",
                    target: target,
                    viaConvoy: orderMode === "Move (Convoy)" 
                };
            }
        case "Support":
            return {
                faction: faction,
                unit: selectedTerritory,
                action: "Support",
                target: target,
                targetUnit: targetUnit,
            };
        case "Retreat":
            return {
                faction: faction,
                unit: selectedTerritory,
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
    },
    formatOrder: (order) => {
        let unit = order.unit ? order.unit.toLowerCase(): "__";
        let target = order.target ? order.target.toLowerCase() : "__";
        let targetUnit = order.targetUnit ? order.targetUnit.toLowerCase() : "__";
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
    }
}