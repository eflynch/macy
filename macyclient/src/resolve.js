
import {dip1900} from './board-spec';
import {Graph} from './graph';

let removeFromArray = (array, item) => {
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
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

let findDisruptedConvoy = (boardSpec, gameState, orders) => {
    let convoyingFleets = [];
    for (let order of orders) {
        if (order.action === "Convoy") {
            convoyingFleets.push(order.unit);
        }
    }

    // Cancel supports that are not broken viaConvoy;

    let conflictGraph = generateConflictGraph(boardSpec, gameState, orders);
};

let resolve = (boardSpec, gameState, orders) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));

    if (["Spring", "Fall"].includes(gameState.season)) {

        let disruptedConvoy = findDisruptedConvoy(boardSpec, gameState, orders);
        // Determine if ANY convoying fleets will be dislodged
        // Cancel those convoy orders
        // Cancel invalid moves
        // Cancel broken supports

        let conflictGraph = generateConflictGraph(boardSpec, gameState, orders);

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
                if (boardSpec.supplyCenters.includes(fleet.replace(" :: NC", "").replace(" :: SC", ""))){
                    occupations[fleet.replace(" :: NC", "").replace(" :: SC", "")] = faction;
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
        for (let order of orders) {
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
