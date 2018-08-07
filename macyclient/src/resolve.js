
import {dip1900} from './board-data';

let gameState = {
    year: 1900,
    season: "Spring",
    factions : {
        "Great Britain": {
            fleet: ["Edinburgh", "Gibraltar", "Egypt"],
            army: ["London"],
            supplyCenters: ["London", "Edinburgh", "Liverpool", "Egypt"]
        },
        "Germany": {
            fleet: ["Kiel"],
            army: ["Cologne", "Munich", "Berlin"],
            supplyCenters: ["Kiel", "Cologne", "Munich", "Berlin"]
        },
        "France": {
            fleet: ["English Channel"],
            army: ["Paris", "Marseilles", "Algeria"],
            supplyCenters: ["Brest", "Paris", "Marseilles", "Algeria"]
        }
    }
};

let orders = [
    {
        power: "Great Britain",
        unit: "London",
        action: "Move",
        targetUnit: null,
        target: "Belgium",
        viaConvoy: true
    },
    {
        power: "Great Britain",
        unit: "Edinburgh",
        action: "Move",
        targetUnit: null,
        target: "North Sea",
        viaConvoy: false
    },
    {
        power: "Great Britain",
        unit: "Gibraltar",
        action: "Move",
        targetUnit: null,
        target: "Morocco",
        viaConvoy: false
    },
    {
        power: "Great Britain",
        unit: "Egypt",
        action: "Move",
        targetUnit: null,
        target: "Eastern Mediterranean",
        viaConvoy: false
    },
    {
        power: "Germany",
        unit: "Kiel",
        action: "Move",
        targetUnit: null,
        target: "Denmark",
        viaConvoy: false
    },
    {
        power: "Germany",
        unit: "Berlin",
        action: "Move",
        targetUnit: null,
        target: "Kiel",
        viaConvoy: false
    },
    {
        power: "Germany",
        unit: "Cologne",
        action: "Move",
        targetUnit: null,
        target: "Netherlands",
        viaConvoy: false
    },
    {
        power: "Germany",
        unit: "Munich",
        action: "Hold",
        targetUnit: null,
        target: null,
        viaConvoy: null
    },
    {
        power: "France",
        unit: "English Channel",
        action: "Convoy",
        targetUnit: "London",
        target: "Belgium",
        viaConvoy: null
    }
]


let resolve = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);

    let validateOrder = (order) => {
        let myFaction = gameState.factions[order.power];
        let unitType;
        if (myFaction.army.includes(order.unit)) {
            unitType = "army";
        } else if (myFaction.fleet.includes(order.unit)) {
            unitType = "fleet";
        } else {
            return false;
        }

        if (order.action === "Move") {
            // Validate distance to target == 1
            if (unitType === "army" && !order.viaConvoy) {
                if (boardSpec.armyGraph.distance(order.unit, order.target) != 1){
                    return false;
                }
            } else if (unitType === "fleet") {
                if (boardSpec.fleetGraph.distance(order.unit, order.target) != 1){
                    return false;
                }
            }
        } else if (order.action === "Support") {
            // Validate that targetUnit exists
            let exists = false;
            for (let faction of factions) {
                let f = gameState.factions[faction];
                if (f.army.includes(order.targetUnit)) {
                    exists = true;
                    break;
                }
                if (f.fleet.includes(order.targetUnit)) {
                    exists = true;
                    break;
                }
            }
            if (!exists){
                return false;
            }

            if (order.target) {
                // Validate distance to target == 1
                if (unitType === "army") {
                    if (boardSpec.armyGraph.distance(order.unit, order.target) != 1){
                        return false;
                    }
                } else if (unitType === "fleet") {
                    if (boardSpec.fleetGraph.distance(order.unit, order.target) != 1){
                        return false;
                    }
                }
            }

        } else if (order.action === "Convoy") {
            if (unitType !== "fleet"){

                return false;
            }
            if (!boardSpec.seas.includes(order.unit)) {

                return false;
            }
        } else if (order.action === "Hold") {
            // No further validation required
        }
        return true;
    };

    let findConvyPaths = (boardSpec, gameState, orders) => {
        for (let order of orders) {
            if (order.action === "Move" && order.viaConvoy) {

                let relevantNodes = [order.unit, order.target];
                for (let order2 of orders) {
                    if (order2.action === "Convoy" && order2.targetUnit === order.unit && order2.target == order.target) {
                        relevantNodes.push(order2.unit);
                    }
                }
                
            }
        }
    };

    let filteredOrders = orders.filter(validateOrder);

    findConvyPaths(boardSpec, gameState, filteredOrders);
    console.log(filteredOrders);

    // Determine if ANY convoying fleets will be dislodged
    // Cancel those convoy orders
    // Cancel invalid moves
    // Cancel broken supports

    // Form conflict graph from remaining moves, supports and holds

    // Resolve head to head move orders
        // If same color, CANCEL both
        // If same value, CANCEL both
        // If different value, CANCEL the lower

    // Now, resolve all unambiguous conflicts

    // Finally, all remaining conflicts consist of a single mover which succeeds

    // CANCEL an edge:
        // If source has hold strength >= 1
            // register dislodged unit from source (with restriction of source unitOrigin)
        // Else source gets hold strength 1
    // SUCCEED an edge:
        // Register move from source to destination
        // Source gets hold strength 0
        // If destination has hold strength >= 1:
            // register dislodged unit from destination ( with restriction of source)
        // Destination gets hold strength 1 (register source as unitOrigin)

};

module.exports = {
    resolve: resolve,
    gameState: gameState,
    boardSpec: dip1900,
    orders: orders
};
