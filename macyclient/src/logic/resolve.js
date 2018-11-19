
import {dip1900} from '../board-spec';
import {Graph, dijsktra} from '../graph';
import {stripCoast} from '../utils';

let removeFromArray = (array, item) => {
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
};

// removes orders that are malformed (not orders that FAIL)
let filterInvalidOrders = (boardSpec, gameState, orders) => {
    const factions = Object.keys(gameState.factions);

    return orders.filter((order) => {
        if (order.action === "Retreat") {
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
            }
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
            }

            if (order.action === "Support") {
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
            if (moveOrder.target === supportOrder.unit && moveOrder.faction !== supportOrder.faction) {
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
            if (moveOrder.target === supportOrder.unit && moveOrder.faction !== supportOrder.faction) {
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
            holds[unit].holdStrength = "?";
            if (moves[target] !== undefined) {
                moves[target].push(
                    {
                        moveStrength: 1,
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
                        moveStrength: 1,
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
            if (order.target !== order.targetUnit) {
                let target = stripCoast(order.target);
                if (moves[target] !== undefined) {
                    for (let move of moves[target]) {
                        if (move.source === order.targetUnit) {
                            move.moveStrength += 1;
                            move.supporters.push(order.unit);
                        }
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

let resolve = (boardSpec, gameState, orders) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));

    if (["Spring Retreat", "Fall Retreat"].includes(gameState.season)) {
        let validOrders = filterInvalidOrders(boardSpec, gameState, orders);

        let retreats = {};
        let disbands = [];
        let managedDislodgements = [];
        for (let order of validOrders) {
            if (order.action === "Retreat") {
                let prevOrder = retreats[stripCoast(order.target)];
                if (prevOrder !== undefined) {
                    disbands.push({
                        faction: prevOrder.faction,
                        unit: prevOrder.source
                    });
                    disbands.push({
                        faction: order.faction,
                        unit: order.unit
                    });
                } else {
                    retreats[stripCoast(order.target)] = {
                        faction: order.faction,
                        source: order.unit,
                        destination: order.target,
                        unitType: order.unitType
                    }
                }
                managedDislodgements.push(order.unit); 
            } else if (order.action === "Disband") {
                disbands.push({
                    faction: order.faction,
                    unit: order.unit
                });
                managedDislodgements.push(order.unit); 
            }
        }
        for (let dislodgement of gameState.dislodged) {
            if (!managedDislodgements.includes(dislodgement.source)){
                disbands.push({
                    faction: dislodgement.faction,
                    unit: dislodgement.source
                });
            }
        }
        for (let retreat of Object.values(retreats)){
            newGameState.factions[retreat.faction][retreat.unitType].push(retreat.destination);
        }

        newGameState.dislodged = [];
    }

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
            if (gameState.factions[move.faction].army.includes(move.source)){
                newGameState.factions[move.faction].army[gameState.factions[move.faction].army.indexOf(move.source)] = move.destination;
            }

            if (gameState.factions[move.faction].fleet.includes(move.source)){
                newGameState.factions[move.faction].fleet[gameState.factions[move.faction].fleet.indexOf(move.source)] = move.destination;
            }
        }
        for (let dislodgement of dislodged) {
            if (gameState.factions[dislodgement.faction].army.includes(dislodgement.source)){
                removeFromArray(newGameState.factions[dislodgement.faction].army, dislodgement.source);
            }
            if (gameState.factions[dislodgement.faction].fleet.includes(dislodgement.source)){
                removeFromArray(newGameState.factions[dislodgement.faction].fleet, dislodgement.source);
            }
        }
        newGameState.dislodged = dislodged;
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
                if (boardSpec.supplyCenters.includes(stripCoast(fleet))){
                    occupations[stripCoast(fleet)] = faction;
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


        let allowedBuilds = {};
        for (let faction of Object.keys(gameState.factions)) {
            let factionDeets = newGameState.factions[faction];
            let unitCount = factionDeets.army.length + factionDeets.fleet.length;
            allowedBuilds[faction] = factionDeets.supplyCenters.length - unitCount;
        }

        for (let order of validOrders) {
            if (order.action === "Build") {
                if (allowedBuilds[order.faction] > 0){
                    newGameState.factions[order.faction][order.unitType].push(order.unit);
                    allowedBuilds[order.faction] -= 1;
                }
            }

            if (order.action === "Disband") {
                if (allowedBuilds[order.faction] < 0) {
                    if (newGameState.factions[order.faction].army.includes(order.unit)){
                        removeFromArray(newGameState.factions[order.faction].army, order.unit);
                    } else if (newGameState.factions[order.faction].fleet.includes(order.unit)){
                        removeFromArray(newGameState.factions[order.faction].fleet, order.unit);
                    } else {
                        console.warn("Something went run with a disband", order);
                    }
                    allowedBuilds[order.faction] += 1;
                }
                
            }
        }
        for (let faction of Object.keys(allowedBuilds)) {
            while (allowedBuilds[faction] < 0){
                // auto disband unit furthest from home (technically should include convoys)
                let furthestArmy = undefined;
                let armyDistance = -1;
                for (let unit of newGameState.factions[faction].army) {
                    let maxDistance = -1;
                    for (let buildPoint of boardSpec.factions[faction].armyBuildPoints) {
                        let distance = boardSpec.graph.army.distance(buildPoint, unit);
                        if (distance > maxDistance){
                            maxDistance = distance;
                        }
                    }
                    if (maxDistance > armyDistance){
                        furthestArmy = unit;
                        armyDistance = maxDistance;
                    }
                }

                let furthestFleet = undefined;
                let fleetDistance = -1;
                for (let unit of newGameState.factions[faction].fleet) {
                    let maxDistance = -1;
                    for (let buildPoint of boardSpec.factions[faction].fleetBuildPoints) {
                        let distance = boardSpec.graph.fleet.distance(buildPoint, unit);
                        if (distance > maxDistance){
                            maxDistance = distance;
                        }
                    }
                    if (maxDistance > fleetDistance){
                        furthestFleet = unit;
                        fleetDistance = maxDistance;
                    }
                }
                if (armyDistance > fleetDistance && furthestArmy != undefined){
                    removeFromArray(newGameState.factions[faction].army, furthestArmy);
                    allowedBuilds[faction] += 1;
                } else {
                    removeFromArray(newGameState.factions[faction].fleet, furthestFleet);
                    allowedBuilds[faction] += 1;
                }
            }
        }
    }
    

    if (gameState.season === "Spring"){
        if (newGameState.dislodged.length) {
            newGameState.season = "Spring Retreat";
        } else {
            newGameState.season = "Fall";
        }
    } else if (gameState.season === "Spring Retreat") {
        newGameState.season = "Fall";
    } else if (gameState.season === "Fall"){
        if (newGameState.dislodged.length) {
            newGameState.season = "Fall Retreat";
        } else {
            newGameState.season = "Winter";
        }
    } else if (gameState.season === "Fall Retreat") {
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
