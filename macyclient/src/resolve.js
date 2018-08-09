
import {dip1900} from './board-spec';
import {Graph} from './graph';

let validateOrders = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);
    let validateMove = (boardSpec, gameState, order) => {
        if (unitType === "army" && !order.viaConvoy) {
            if (boardSpec.armyGraph.distance(order.unit, order.target) != 1){
                return false;
            }
        } else if (unitType === "fleet") {
            if (boardSpec.fleetGraph.distance(order.unit, order.target) != 1){
                return false;
            }
        }
    };
    let validateSupport = (boardSpec, gameState, order) => {
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
    };
    let validateConvoy = (boardSpec, gameState, order) => {
        if (unitType !== "fleet"){
            return false;
        }
        if (!boardSpec.seas.includes(order.unit)) {
            return false;
        }
    };
    let validateHold = (boardSpec, gameState, order) => {

    };
    let validateBuild = (boardSpec, gameState, order) => {

    };
    let validateDisband = (boardSpec, gameState, order) => {

    };

    let orderedUnits = [];
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

        if (orderedUnits.includes(order.unit)){
            return false;
        }

        orderedUnits.push(order.unit);

        if (order.action === "Move") {
            return validateMove(boardSpec, gameState, order, unitType);
        } else if (order.action === "Support") {
            return validateSupport(boardSpec, gameState, order, unitType);
        } else if (order.action === "Convoy") {
            return validateConvy(boardSpec, gameState, order, unitType);
        } else if (order.action === "Hold") {
            return validateHold(boardSpec, gameState, order, unitType);
        } else if (order.action === "Build") {
            return validateBuild(boardSpec, gameState, order, unitType);
        } else if (order.action === "Disband") {
            return validateDisband(boardSpec, gameState, order, unitType);
        }
        return true;
    };
    return orders.filter(validateOrder);
};

let findValidConvoyPaths = (boardSpec, gameState, orders) => {
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

let generateConflictGraph = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);
    let holds = {};
    for (let faction of factions) {
        gameState.factions[faction].army.forEach((a) => {holds[a] = {
            holdStrength: 1,
            power: faction,
            unit: a
        };});
        gameState.factions[faction].fleet.forEach((a) => {holds[a] = {
            holdStrength: 1,
            power: faction,
            unit: a
        };});
    }

    let moves = {};
    for (let order of orders) {
        if (order.action === "Move") {
            holds[order.unit].holdStrength = "?";
            if (moves[order.target] !== undefined) {
                moves[order.target].push(
                    {
                        moveStrength: 1,
                        power: order.power,
                        source: order.unit,
                        destination: order.target,
                        viaConvoy: order.viaConvoy
                    }
                );
            } else {
                moves[order.target] = [
                    {
                        moveStrength: 1,
                        power: order.power,
                        source: order.unit,
                        destination: order.target,
                        viaConvoy: order.viaConvoy
                    }
                ]
            }
            
        }
    }

    for (let order of orders) {
        if (order.action === "Support") {
            if (order.target !== undefined && order.target !== null) {
                for (let move of moves[order.target]) {
                    if (move.source === order.targetUnit) {
                        move.moveStrength += 1;
                    }
                }
            } else {
                let hold = holds[order.targetUnit];
                if (hold.holdStrength != "?"){
                    hold.holdStrength += 1;
                }
            }
        }
    }
    return {
        holds: holds,
        moves: moves
    };
};

let resolveHeadToHead = (conflictGraph) => {
    const moveDests = Object.keys(conflictGraph.moves);

    let dislodged = [];
    let cancel = (move) => {
        if (conflictGraph.holds[move.source].holdStrength !== "?") {
            dislodged.push({
                source: move.source,
                restriction: conflictGraph.holds[move.source].unitOrigin
            });
        } else {
            conflictGraph.holds[move.source].holdStrength = 1;
            conflictGraph.moves[move.destination] = conflictGraph.moves[move.destination].filter((m) => m !== move);
        }
    }
    for (let dest of moveDests) {
        for (let move of conflictGraph.moves[dest]) {
            if (conflictGraph.moves[move.source] !== undefined) {
                for (let move2 of conflictGraph.moves[move.source]) {
                    if (move2.source === dest){
                        if (move.viaConvoy && move2.viaConvoy){
                            continue;
                        }
                        if (move.power === move2.power) {
                            cancel(move);
                            cancel(move2);
                        } else if (move.moveStrength === move2.moveStrength) {
                            cancel(move);
                            cancel(move2);
                        } else if (move.moveStrenth > move2.moveStrenth) {
                            cancel(move2);
                        } else {
                            cancel(move);
                        }
                    }
                } 
            }
            
        }
    }
};

let resolveUnambiguous = (conflictGraph) => {
    let dislodged = [];
    let moved = [];
    let cancel = (move) => {
        if (conflictGraph.holds[move.source].holdStrength !== "?") {
            dislodged.push({
                source: move.source,
                restriction: conflictGraph.holds[move.source].unitOrigin
            });
        } else {
            conflictGraph.holds[move.source].holdStrength = 1;
            conflictGraph.moves[move.destination] = conflictGraph.moves[move.destination].filter((m) => m !== move);
        }
    };

    let succeed = (move) => {
        moved.push({
            power: move.power,
            source: move.source,
            destination: move.destination
        });
        if (conflictGraph.holds[move.source] !== undefined && conflictGraph.holds[move.source].holdStrength === "?") {
            conflictGraph.holds[move.source].holdStrength = 0;
        }
        if (conflictGraph.holds[move.destination] !== undefined && conflictGraph.holds[move.destination].holdStrength >= 1) {
            dislodged.push({
                source: move.destination,
                restriction: move.source
            });
        }
        conflictGraph.holds[move.destination] = {
            holdStrength: 1,
            power: move.power,
            unit: move.destination,
            unitOrigin: move.source
        };
    };

    let resolvedOne = true;
    while(resolvedOne) {
        const moveDests = Object.keys(conflictGraph.moves);
        resolvedOne = false;
        for (let dest of moveDests) {
            let maxHoldStrength = 0;
            let minHoldStrength = 0;
            if (conflictGraph.holds[dest] === undefined) {
            } else if (conflictGraph.holds[dest].holdStrength === "?") {
                maxHoldStrength = 1;
            } else {
                maxHoldStrength = conflictGraph.holds[dest].holdStrength;
                minHoldStrength = maxHoldStrength;
            }

            let moveStrengths = conflictGraph.moves[dest].map((move)=>move.moveStrength);
            let maxMoveStrength = Math.max(...moveStrengths);
            if (maxMoveStrength > maxHoldStrength) {
                if (moveStrengths.indexOf(maxMoveStrength) == moveStrengths.lastIndexOf(maxMoveStrength)) {

                    // prevent self-dislodgement in this ambiguous case
                    if (maxHoldStrength >= 1 && conflictGraph.holds[dest] !== undefined && conflictGraph.moves[dest][moveStrengths.indexOf(maxMoveStrength)].power === conflictGraph.holds[dest].power){
                        console.log(conflictGraph.holds[dest]);
                        continue;
                    }

                    for (let move of conflictGraph.moves[dest]) {
                        if (move.moveStrength === maxMoveStrength) {
                            succeed(move);
                        } else {
                            cancel(move);
                        }
                    }
                } else {
                    for (let move of conflictGraph.moves[dest]) {
                        cancel(move);
                    }
                }
                resolvedOne = true;
                delete conflictGraph.moves[dest];
                continue;
            }
            if (maxMoveStrength <= minHoldStrength) {
                for (let move of conflictGraph.moves[dest]) {
                    cancel(move);
                }
                resolvedOne = true;
                delete conflictGraph.moves[dest];
                continue;
            }
        }
    }


    // All remaining moves succeed
    const moveDests = Object.keys(conflictGraph.moves);
    for (let dest of moveDests) {
        for (let move of conflictGraph.moves[dest]) {
            succeed(move);
        }
    }

    return {
        dislodged: dislodged,
        moved: moved
    };
};

let resolve = (boardSpec, gameState, orders) => {
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

    let conflictGraph = generateConflictGraph(boardSpec, gameState, orders);

    resolveHeadToHead(conflictGraph);

    let {dislodged, moved} = resolveUnambiguous(conflictGraph);


    let newGameState = JSON.parse(JSON.stringify(gameState));
    // Update gameState
    for (let move of moved){
        if (gameState.factions[move.power].army.includes(move.source)){
            newGameState.factions[move.power].army[gameState.factions[move.power].army.indexOf(move.source)] = move.destination;
        }

        if (gameState.factions[move.power].fleet.includes(move.source)){
            newGameState.factions[move.power].fleet[gameState.factions[move.power].fleet.indexOf(move.source)] = move.destination;
        }
    }

    if (gameState.season === "Spring"){
        newGameState.season = "Fall";
    } else if (gameState.season === "Fall"){
        newGameState.season = "Winter";
    } else if (gameState.season === "Winter") {
        newGameState.season = "Spring";
        newGameState.year += 1;
    }
    return newGameState;

};

module.exports = {
    resolve: resolve,
};
