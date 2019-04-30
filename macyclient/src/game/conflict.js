import {stripCoast, removeFromArray} from './utils';

// This assumes all remaining move orders are valid
// And all remaining support orders are NOT cut
let generateConflictGraph = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);
    let holds = {};
    for (let faction of factions) {
        gameState.factions[faction].army.forEach((a) => {holds[a] = {
            holdStrength: 1,
            faction: faction,
            unit: a,
            realUnit: a,
            unitType: "army"
        };});
        gameState.factions[faction].fleet.forEach((f) => {holds[stripCoast(f)] = {
            holdStrength: 1,
            faction: faction,
            unit: stripCoast(f),
            realUnit: f,
            unitType: "fleet"
        };});
    }

    let moves = {};
    for (let order of orders) {
        if (order.action === "Move") {
            let unitType;
            if (gameState.factions[order.faction].army.includes(order.unit)) {
                unitType = "army";
            } else if (gameState.factions[order.faction].fleet.includes(order.unit)) {
                unitType = "fleet";
            }
            let unit = stripCoast(order.unit);
            let target = stripCoast(order.target);
            let strength = 1;
            holds[unit].holdStrength = "?";

            // let customEdge = boardSpec.customEdges[makeKey(order.unit, order.target)];
            // if (customEdge !== undefined) {
            //     strength = customEdge.move;
            // }
            if (moves[target] !== undefined) {
                moves[target].push(
                    {
                        moveStrength: strength,
                        faction: order.faction,
                        source: order.unit,
                        unitType: unitType,
                        destination: target,
                        realDestination: order.target,
                        viaConvoy: order.viaConvoy,
                        supporters: []
                    }
                );
            } else {
                moves[target] = [
                    {
                        moveStrength: strength,
                        faction: order.faction,
                        source: order.unit,
                        unitType: unitType,
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
            let unit = stripCoast(order.unit);
            let targetUnit = stripCoast(order.targetUnit);
            let strength = 1;
            // let customEdge = boardSpec.customEdges[makeKey(order.unit, order.target)];
            // if (customEdge !== undefined) {
                // strength = customEdge.support;
            // }
            if (order.target !== order.targetUnit) {
                let target = stripCoast(order.target);
                if (moves[target] !== undefined) {
                    for (let move of moves[target]) {
                        if (move.source === order.targetUnit) {
                            move.moveStrength += strength;
                            move.supporters.push(order.unit);
                        }
                    }
                }
            } else {
                let hold = holds[targetUnit];
                if (hold !== undefined && hold.holdStrength != "?"){
                    hold.holdStrength += strength;
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

    let cancel = (move) => {
        conflictGraph.holds[move.source].holdStrength = 1;
        removeFromArray(conflictGraph.moves[move.destination], move);
    }
    for (let dest of moveDests) {
        for (let move of conflictGraph.moves[dest]) {
            if (conflictGraph.moves[move.source] !== undefined) {
                for (let move2 of conflictGraph.moves[move.source]) {
                    if (move2.source === dest){
                        if (move.viaConvoy && move2.viaConvoy){
                            continue;
                        }
                        if (move.faction === move2.faction) {
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
                faction: move.faction,
                source: move.source,
                unitType: move.unitType,
                restriction: conflictGraph.holds[move.source].unitOrigin
            });
        } else {
            conflictGraph.holds[move.source].holdStrength = 1;
            removeFromArray(conflictGraph.moves[move.destination], move);
        }
    };

    let succeed = (move) => {
        moved.push({
            faction: move.faction,
            source: move.source,
            destination: move.realDestination
        });
        if (conflictGraph.holds[move.source] !== undefined && conflictGraph.holds[move.source].holdStrength === "?") {
            conflictGraph.holds[move.source].holdStrength = 0;
        }
        if (conflictGraph.holds[move.destination] !== undefined && conflictGraph.holds[move.destination].holdStrength >= 1) {
            dislodged.push({
                faction: conflictGraph.holds[move.destination].faction,
                source: conflictGraph.holds[move.destination].realUnit,
                unitType: conflictGraph.holds[move.destination].unitType,
                restriction: move.source
            });
        }
        conflictGraph.holds[move.destination] = {
            holdStrength: 1,
            faction: move.faction,
            unit: move.destination,
            unitOrigin: move.source,
            unitType: move.unitType,
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
                    if (maxHoldStrength >= 1 && conflictGraph.holds[dest] !== undefined && conflictGraph.moves[dest][moveStrengths.indexOf(maxMoveStrength)].faction === conflictGraph.holds[dest].faction){
                        continue;
                    }

                    let toSucceed = [];
                    let toCancel = [];
                    for (let move of conflictGraph.moves[dest]) {
                        if (move.moveStrength === maxMoveStrength) {
                            toSucceed.push(move);
                        } else {
                            toCancel.push(move);
                        }
                    }
                    for (let move of toSucceed){
                        succeed(move);
                    }
                    for (let move of toCancel){
                        cancel(move);
                    }
                } else {
                    let toCancel = [];
                    for (let move of conflictGraph.moves[dest]) {
                        toCancel.push(move);
                    }
                    for (let move of toCancel){
                        cancel(move);
                    }
                }
                resolvedOne = true;
                delete conflictGraph.moves[dest];
                continue;
            }
            if (maxMoveStrength <= minHoldStrength) {
                let toCancel = [];
                for (let move of conflictGraph.moves[dest]) {
                    toCancel.push(move);
                }
                for (let move of toCancel){
                    cancel(move);
                }
                resolvedOne = true;
                delete conflictGraph.moves[dest];
                continue;
            }
        }
    }


    // All remaining moves succeed unless they lead to self dislodgement
    const moveDests = Object.keys(conflictGraph.moves);
    for (let dest of moveDests) {
        for (let move of conflictGraph.moves[dest]) {
            if (move.faction !== conflictGraph.holds[dest].faction){
                succeed(move);
            }
        }
    }

    return {
        dislodged: dislodged,
        moved: moved
    };
};


// WARNING: This does not consider cut supports, so remove cut support orders before calling this
let resolveOrders = (boardSpec, gameState, orders) => {
    let conflictGraph = generateConflictGraph(boardSpec, gameState, orders);
    resolveHeadToHead(conflictGraph);
    return resolveUnambiguous(conflictGraph); 
};


module.exports = {
    generateConflictGraph: generateConflictGraph,
    resolveOrders: resolveOrders
};
