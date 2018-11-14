        

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
}