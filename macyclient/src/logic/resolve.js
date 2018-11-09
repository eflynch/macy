
import {dip1900} from '../board-spec';
import {Graph, dijsktra} from '../graph';

let removeFromArray = (array, item) => {
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
};

let strip_coast = (fleet) => {
    return fleet
        .replace(" :: NC", "")
        .replace(" :: SC", "")
        .replace(" :: WC", "")
        .replace(" :: EC", "");
}

// removes orders that are malformed (not orders that FAIL)
let filterInvalidOrders = (boardSpec, gameState, orders) => {
    return orders.filter((order) => {
        if (order.action === "Build") {

        } else {
            let unitType;
            if (gameState.factions[order.power].army.includes(order.unit)) {
                unitType = "army";
            } else if (gameState.factions[order.power].fleet.includes(order.unit)) {
                unitType = "fleet";
            } else {
                return false;
            }

            if (order.action === "Move") {
                if (!order.viaConvoy && boardSpec.graph[unitType].distance(order.unit, order.target) != 1) {
                    console.log("Invalid move", order);
                    console.log(boardSpec.graph.fleet);
                    return false;
                }
            }
            if (order.action === "Support") {
                if (order.target !== undefined && order.target !== null) { // Move Support
                    let target = unitType === "army" ? strip_coast(order.target) : order.target;
                    if (boardSpec.graph[unitType].distance(order.unit, target) != 1) {
                        return false;
                    }
                } else { // Hold Support
                    if (boardSpec.graph[unitType].distance(order.unit, order.targetUnit) != 1) {
                        return false;
                    }
                }
            }
            if (order.action === "Convoy") {
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
};

// remove any extra orders given to units
let ignoreExtraOrders = (boardSpec, gameState, orders) => {
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

// removes support orders that FAIL because they are cut by a non-convoyed unit
let cutSupportOrdersByNonConvoyed = (boardSpec, gameState, orders) => {
    let supportOrders = orders.filter((order) => order.action === "Support");
    let moveOrders = orders.filter((order) => order.action === "Move" && !order.viaConvoy);
    let brokenSupports = [];
    for (let moveOrder of moveOrders) {
        for (let supportOrder of supportOrders) {
            if (moveOrder.target === supportOrder.unit && moveOrder.power !== supportOrder.power) {
                brokenSupports.push(supportOrder);
            }
        }
    }
    for (let brokenSupport of brokenSupports) {
        removeFromArray(orders, brokenSupport);
    }
};


// moveOrder => [path, path, etc.]
let getConvoyMap = (boardSpec, gameState, orders) => {
    let convoyMap = [];
    for (let order of orders) {
        if (order.action === "Move" && order.viaConvoy) {
            let convoyers = [];
            for (let order2 of orders) {
                if (order2.action === "Convoy" && order2.targetUnit === order.unit && order2.target === order.target) {
                    convoyers.push(order2.unit);
                }
            }
           
            convoyMap.push({
                moveOrder: order,
                convoyers: convoyers
            });
        }
    }
    return convoyMap;
};

// generates map of convoying fleets that Could be dislodged
// fleet => (holdStrength, moveStrength, supporters (of invasion))
let generateDislodgedConvoyerMap = (boardSpec, gameState, orders) => {
    let {holds, moves} = generateConflictGraph(boardSpec, gameState, orders);
    let convoyOrders = orders.filter((order) => order.action === "Convoy");
    let map = {};
    for (let convoyOrder of convoyOrders) {
        let moveStrength = 0;
        if (moves[convoyOrder.unit] !== undefined) {
            let holdStrength = holds[convoyOrder.unit].holdStrength;
            let moveStrenth = moves[convoyOrder.unit].moveStrength;
            if (holdStrength < moveStrength) {
                    map[convoyOrder.unit] = {
                    holdStrength: holdStrength,
                    moveStrength: moveStrength,
                    invasionSupporters: moves[convoyOrder.unit].supporters
                };
            }
        }
    }
    return map;
};

// The algorithm here is
// Collect list of convoying fleets that could be dislodged (holdStrength, moveStrenth, moveSupporters)
// Collect list of convoyed moves with convoying fleet sets

// while true:
    // Check if there is a convoyed move order that is certain
    // i.e. there is a valid path throuch convoying fleets that are not in the dislodgement list
        // if there is, cut supports at destination if they exist (adjusting dislodgement list)
        // Move sucessful convoyed move to success list

    // Check if there is a fleet that will surely be dislodged
// if there are still  ambiguous fleet dislodgements, they are all dislodged
let filterFailedConvoyMovesAndCutSupportOrdersByConvoyed = (boardSpec, gameState, orders) => {
    let convoyMap = getConvoyMap(boardSpec, gameState, orders);
    let dislodgedConvoyerMap = generateDislodgedConvoyerMap(boardSpec, gameState, orders);

    let cutSupports = (moveOrder) => {
        let supportOrders = orders.filter((order) => order.action === "Support");
        for (let supportOrder of supportOrders) {
            if (moveOrder.target === supportOrder.unit && moveOrder.power !== supportOrder.power) {
                removFromArray(orders, supportOrder);
                break;
            }
        }
        for (let fleet of Object.keys(dislodgedConvoyerMap)) {
            if (dislodgedConvoyerMap[fleet].supporters.includes(target)){
                removeFromArray(dislodgedConvoyerMap[fleet].invasionSupporters, target);
                dislodgedConvoyerMap[fleet].moveStrength -= 1;
            }
            if (dislodgedConvoyerMap[fleet].holdStrength >= dislodgedConvoyerMap[fleet].moveStrength) {
                delete dislodgedConvoyerMap[fleet];
                return false;
            }
        }
        return true;
    };

    let successfulConvoyedMoves = [];
    while(true) {
        let done = true;

        // Check if there is a convoyed move order that is certain
        for (let convoyPair of convoyMap) {
            let {moveOrder, convoyers} = convoyPair;
            let safeConvoyers = convoyers.filter((c)=>!Object.keys(dislodgedConvoyerMap).includes(c));
            let fleetSubGraph = boardSpec.graph.fleet.clone();
            fleetSubGraph.removeAllBut(convoyers.concat([moveOrder.unit, moveOrder.target]));
            if (fleetSubGraph.distance(moveOrder.unit, moveOrder.target)) {
                done = cutSupports(moveOrder);
                removeFromArray(convoyMap, convoyPair);
                break;
            }
        }

        if (done){
            break;
        }
    }

    // Any remaining fleets in dislodgementMap are dislodged at this point
    // Any remaining convoys in convoyMap fail
};

// This assumes all remaining move orders are valid
// And all remaining support orders are NOT cut
let generateConflictGraph = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);
    let holds = {};
    for (let faction of factions) {
        gameState.factions[faction].army.forEach((a) => {holds[a] = {
            holdStrength: 1,
            power: faction,
            unit: a
        };});
        gameState.factions[faction].fleet.forEach((f) => {holds[strip_coast(f)] = {
            holdStrength: 1,
            power: faction,
            unit: strip_coast(f)
        };});
    }

    let moves = {};
    for (let order of orders) {
        if (order.action === "Move") {
            let unit = strip_coast(order.unit);
            let target = strip_coast(order.target);
            holds[unit].holdStrength = "?";
            if (moves[target] !== undefined) {
                moves[target].push(
                    {
                        moveStrength: 1,
                        power: order.power,
                        source: order.unit,
                        destination: target,
                        realDestination: order.target,
                        viaConvoy: order.viaConvoy,
                        supporters: []
                    }
                );
            } else {
                moves[target] = [
                    {
                        moveStrength: 1,
                        power: order.power,
                        source: order.unit,
                        destination: target,
                        realDestination: order.target,
                        viaConvoy: order.viaConvoy,
                        supporters: []
                    }
                ]
            }
            
        }
    }

    for (let order of orders) {
        if (order.action === "Support") {
            let unit = strip_coast(order.unit);
            let targetUnit = strip_coast(order.targetUnit);
            if (order.target !== undefined && order.target !== null) {
                let target = strip_coast(order.target);
                for (let move of moves[target]) {
                    if (move.source === order.targetUnit) {
                        move.moveStrength += 1;
                        move.supporters.push(order.unit);
                    }
                }
            } else {
                let hold = holds[targetUnit];
                if (hold !== undefined && hold.holdStrength != "?"){
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
            removeFromArray(conflictGraph.moves[move.destination], move);
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
                        } else if (move.moveStrength > move2.moveStrength) {
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
            removeFromArray(conflictGraph.moves[move.destination], move);
        }
    };

    let succeed = (move) => {
        moved.push({
            power: move.power,
            source: move.source,
            destination: move.realDestination
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
    let newGameState = JSON.parse(JSON.stringify(gameState));

    if (["Spring", "Fall"].includes(gameState.season)) {
        let validOrders = filterInvalidOrders(boardSpec, gameState, orders);
        ignoreExtraOrders(boardSpec, gameState, validOrders);
        cutSupportOrdersByNonConvoyed(boardSpec, gameState, validOrders);

        filterFailedConvoyMovesAndCutSupportOrdersByConvoyed(boardSpec, gameState, validOrders);

        let conflictGraph = generateConflictGraph(boardSpec, gameState, validOrders);
        resolveHeadToHead(conflictGraph);
        let {dislodged, moved} = resolveUnambiguous(conflictGraph);

        // Update gameState
        for (let move of moved){
            if (gameState.factions[move.power].army.includes(move.source)){
                newGameState.factions[move.power].army[gameState.factions[move.power].army.indexOf(move.source)] = move.destination;
            }

            if (gameState.factions[move.power].fleet.includes(move.source)){
                newGameState.factions[move.power].fleet[gameState.factions[move.power].fleet.indexOf(move.source)] = move.destination;
            }
        }
    }

    // In the fall update supply center occupations
    if (gameState.season === "Fall") {
        const factions = Object.keys(gameState.factions);
        let occupations = {};
        for (let faction of factions) {
            for (let army of newGameState.factions[faction].army) {
                if (boardSpec.supplyCenters.includes(army)){
                    occupations[army] = faction;
                }
            }

            for (let fleet of newGameState.factions[faction].fleet) {
                if (boardSpec.supplyCenters.includes(strip_coast(fleet))){
                    occupations[strip_coast(fleet)] = faction;
                }
            }
        }
        for (let occupiedSupplyCenter of Object.keys(occupations)) {
            for (let faction of factions) {
                if (faction !== occupations[occupiedSupplyCenter] && newGameState.factions[faction].supplyCenters.includes(occupiedSupplyCenter)) {
                    removeFromArray(newGameState.factions[faction].supplyCenters, occupiedSupplyCenter);
                }

                if (faction === occupations[occupiedSupplyCenter] && !newGameState.factions[faction].supplyCenters.includes(occupiedSupplyCenter)) {
                    newGameState.factions[faction].supplyCenters.push(occupiedSupplyCenter);
                }
            }
        }
    }

    if (gameState.season === "Winter") {
        let validOrders = filterInvalidOrders(boardSpec, gameState, orders);
        ignoreExtraOrders(boardSpec, gameState, validOrders);
        for (let order of validOrders) {
            if (order.action === "Build") {
                newGameState.factions[order.power][order.unitType].push(order.unit);
            }

            if (order.action === "Disband") {
                if (newGamestate.factions[order.power].army.includes(order.unit)){
                    removeFromArray(newGamestate.factions[order.power].army, order.target);
                }
                if (newGamestate.factions[order.power].fleet.includes(order.unit)){
                    removeFromArray(newGamestate.factions[order.power].fleet, order.unit);
                }
            }
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
