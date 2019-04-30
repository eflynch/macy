
import {dip1900} from '../board-spec';
import {Graph, dijsktra} from './graph';
import {stripCoast, removeFromArray} from './utils';
import {resolveOrders, generateConflictGraph} from './conflict';
import {filterInvalidOrders} from './filter';

let makeKey = (a, b) => [a, b].join(",");


let checkConvoyGraph = (boardSpec, convoy, safeConvoyers) => {
    let graphNodes = safeConvoyers.concat([]);
    let convoyGraph = boardSpec.graph.fleet.clone();

    // Add nodes for src and relevant coasts
    graphNodes.push(convoy.moveOrder.unit);
    if (boardSpec.multiCoast[convoy.moveOrder.unit] !== undefined) {
        for (let coast of boardSpec.multiCoast[convoy.moveOrder.unit]) {
            graphNodes.push(`${convoy.moveOrder.unit} :: ${coast}`);
        }
    }

    // Add nodes for dest and relevant coasts
    graphNodes.push(convoy.moveOrder.target);
    if (boardSpec.multiCoast[convoy.moveOrder.target] !== undefined) {
        for (let coast of boardSpec.multiCoast[convoy.moveOrder.target]) {
            graphNodes.push(`${convoy.moveOrder.target} :: ${coast}`);
        }
    }

    convoyGraph.removeAllBut(graphNodes);

    // Add 0 edges between src and dest and relevant coasts
    if (boardSpec.multiCoast[convoy.moveOrder.unit] !== undefined) {
        convoyGraph.addNode(convoy.moveOrder.unit);
        for (let coast of boardSpec.multiCoast[convoy.moveOrder.unit]) {
            convoyGraph.addEdge(convoy.moveOrder.unit, `${convoy.moveOrder.unit} :: ${coast}`, 0);
        }
    }

    // Add nodes for dest and relevant coasts
    if (boardSpec.multiCoast[convoy.moveOrder.target] !== undefined) {
        convoyGraph.addNode(convoy.moveOrder.target);
        for (let coast of boardSpec.multiCoast[convoy.moveOrder.target]) {
            convoyGraph.addEdge(`${convoy.moveOrder.target} :: ${coast}`, convoy.moveOrder.target, 0);
        }
    }

    let check = convoyGraph.distance(convoy.moveOrder.unit, convoy.moveOrder.target) !== undefined;
    return check;
};

// removes support orders that FAIL because they are cut by a non-convoyed unit
let getCutSupportOrders = (boardSpec, gameState, orders) => {
    let supportOrders = orders.filter((order) => order.action === "Support");
    let moveOrders = orders.filter((order) => order.action === "Move");
    let cutSupports = [];
    for (let moveOrder of moveOrders) {
        for (let supportOrder of supportOrders) {
            const moveTargetsSupporter = moveOrder.target === supportOrder.unit;
            const supportDoesNotTargetMover = supportOrder.target !== moveOrder.unit;
            const moveDoesNotCutOwnSupport = moveOrder.faction !== supportOrder.faction;
            if (moveTargetsSupporter && supportDoesNotTargetMover && moveDoesNotCutOwnSupport) {
                cutSupports.push(supportOrder);
            }
        }
    }
    return cutSupports;
};

// moveOrder => [path, path, etc.]
let getConvoyMap = (orders) => {
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


let filterFailedConvoyMovesAndCutSupportOrdersByConvoyed = (boardSpec, gameState, orders) => {
    let getDefinitelySafeConvoyers = (boardSpec, gameState, orders) => {
        // It's safe if it is not dislodged in the worst case
        // It's definitely safe if the lowest possible hold is >= than the highest
        // possible move strength. The lowest possible hold is 1 + the number of
        // supports that are not threatened by an army convoyed
        // The highest possible move strength is 1 + the number of supports not including
        // one that would be cut if this convoy succeeds
        // So that means we need to resolve the graph after cutting supports:
        //    supports threatened by a convoyed army that support a convoyer
        //    support that would be cut by this convoyed army that supports an invasion of a convoyer
        // BUT that is equivalent to cutting:
        //    supports to hold
        const convoyOrders = orders.filter((order) => order.action === "Convoy");
        let ordersExcludingInvasionSupport = orders.filter((order)=>{
            if (order.action === "Support"){
                // We must only cut hold supports
                return order.target === order.targetUnit;
            }
            return true;
        });
        let cutSupportOrders = getCutSupportOrders(boardSpec, gameState, ordersExcludingInvasionSupport);
        let relevantOrders = orders.filter((order) => !cutSupportOrders.includes(order));
        let {dislodged, moves} = resolveOrders(boardSpec, gameState, relevantOrders);
        const definitelySafeConvoyers = convoyOrders.filter((convoyOrder) => {
            for (let dislodgement of dislodged) {
                if (dislodgement.source === convoyOrder.unit) {
                    return false;
                }
            }
            return true;
        }).map((convoyOrder) => {
            return convoyOrder.unit;
        });
        return definitelySafeConvoyers;
    };

    let getDefinitelyDislodgedConvoyers = (boardspec, gameState, orders) => {
        // It's dislodged if it is dislodged in the worst case
        // It's definitely not safe if the highest possible hold is lower than
        // the lowest possible move strength. The highest possible hold is
        // 1 + the number of supports. The lowest possible move is
        // 1 + the number of supports that are not threatened by an army
        // convoyed (discounting threats by this convoyed army)
        // So that means we need to resolve the graph after cutting supports:
        //     supports for invasions of a convoyer that are threatened by a convoyed army
        //       that is not this convoyed army
        // But That is equivalnet to cutting:
        //     supports to move (except threatened by convoyOrder's move)
        const convoyOrders = orders.filter((order) => order.action === "Convoy");

        const definitelyDislodgedConvoyers = convoyOrders.filter((convoyOrder) => {
            let ordersExcludingHoldSupportsAndSupportsFromConvoyTarget = orders.filter((order)=>{
                if (order.action === "Support"){
                    if (convoyOrder.target === order.unit){
                        return false;
                    }
                    // We must only cut invasion supports
                    return order.target !== order.targetUnit;
                }
                return true;
            });
            let cutSupportOrders = getCutSupportOrders(boardSpec, gameState, ordersExcludingHoldSupportsAndSupportsFromConvoyTarget);
            let relevantOrders = orders.filter((order) => !cutSupportOrders.includes(order));
            let {dislodged, moves} = resolveOrders(boardSpec, gameState, relevantOrders);
            for (let dislodgement of dislodged) {
                if (dislodgement.source === convoyOrder.unit) {
                    return true;
                }
            }
            return false;
        }).map((convoyOrder) => {
            return convoyOrder.unit;
        });
        return definitelyDislodgedConvoyers;
    };

    let cutSupports = (moveOrder) => {
        let supportOrders = orders.filter((order) => order.action === "Support");
        for (let supportOrder of supportOrders) {
            if (moveOrder.target === supportOrder.unit && moveOrder.faction !== supportOrder.faction) {
                removeFromArray(orders, supportOrder);
                break;
            }
        }
    };

    let convoyMap = getConvoyMap(orders);

    while(true) {
        let ctn = false;
        // Check if there is a convoyed move order that will succeed
        for (let convoy of convoyMap) {
            let allSafeConvoyers = getDefinitelySafeConvoyers(boardSpec, gameState, orders);
            let definitelySafeConvoyers = convoy.convoyers.filter((c)=>allSafeConvoyers.includes(c));
            if (checkConvoyGraph(boardSpec, convoy, definitelySafeConvoyers)) {
                // cut support orders from target of move order
                cutSupports(convoy.moveOrder);
                // remove convoy from the convoyMap
                removeFromArray(convoyMap, convoy);
                ctn = true;
                break;
            }
        }

        // Check if there is a convoyed move order that will fail
        for (let convoy of convoyMap) {
            let definitelyDislodgedConvoyers = getDefinitelyDislodgedConvoyers(boardSpec, gameState, orders);
            let maybeSafeConvoyers = convoy.convoyers.filter((c)=>!definitelyDislodgedConvoyers.includes(c));
            if (!checkConvoyGraph(boardSpec, convoy, maybeSafeConvoyers)) {
                // remove move order
                removeFromArray(orders, convoy.moveOrder);
                // remove convoy from convoyMap
                removeFromArray(convoyMap, convoy);
                ctn = true;
                break;
            }
        }

        if (!ctn){
            break;
        }
    }

    if (convoyMap.length){
        console.warn("Not all convoys were processed", convoyMap);
    }
};

let resolveRetreat = (boardSpec, gameState, orders) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));
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

    if (gameState.season === "Spring Retreat") {
        newGameState.season = "Fall";
    } else if (gameState.season === "Fall Retreat") {
        newGameState.season = "Winter";
    } else {
        console.warn("Bad season yo");
    }
    return newGameState;
}

let resolveAction = (boardSpec, gameState, orders) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    let validOrders = filterInvalidOrders(boardSpec, gameState, orders);

    let nonConvoyedOrders = validOrders.filter((order)=>{
        if (order.action === "Move" && order.viaConvoy){return false;}
        return true;
    });
    let cutSupportOrders = getCutSupportOrders(boardSpec, gameState, nonConvoyedOrders);
    for (let so of cutSupportOrders){
        removeFromArray(validOrders, so);
    }

    filterFailedConvoyMovesAndCutSupportOrdersByConvoyed(boardSpec, gameState, validOrders);

    let {dislodged, moved} = resolveOrders(boardSpec, gameState, validOrders);

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

    if (gameState.season === "Spring"){
        if (newGameState.dislodged.length) {
            newGameState.season = "Spring Retreat";
        } else {
            newGameState.season = "Fall";
        }
    } else if (gameState.season === "Fall"){
        if (newGameState.dislodged.length) {
            newGameState.season = "Fall Retreat";
        } else {
            newGameState.season = "Winter";
        }
    } else {
        console.warn("Bad season yo");
    }
    return newGameState;
}

let resolveWinter = (boardSpec, gameState, orders) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    let validOrders = filterInvalidOrders(boardSpec, gameState, orders);

    let allowedBuilds = {};
    for (let faction of Object.keys(gameState.factions)) {
        let factionDeets = newGameState.factions[faction];
        let factionSpec = boardSpec.factions[faction];
        let unitCount = factionDeets.army.length + factionDeets.fleet.length;
        let supplyCount = factionDeets.supplyCenters.length;
        if (factionSpec.emergencyBuildPoints) {
            let buildPoints = factionSpec.armyBuildPoints.concat(factionSpec.fleetBuildPoints).filter((bp)=>{return !bp.includes(" :: ");});
            let hasLostBuildPoints = buildPoints.some((buildPoint)=>{
                return !factionDeets.supplyCenters.includes(buildPoint);
            });
            let hasNotLostAllBuildPoints = buildPoints.some((buildPoint)=>{
                return factionDeets.supplyCenters.includes(buildPoint);
            })
            if (hasLostBuildPoints && hasNotLostAllBuildPoints) {
                supplyCount += factionSpec.emergencyBuildPoints.length;
            }
        }
        allowedBuilds[faction] = supplyCount - unitCount;
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
                    console.warn("Something went wrong with a disband", order);
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

    newGameState.season = "Spring";
    newGameState.year += 1;
    return newGameState;
}


let resolve = (boardSpec, gameState, orders) => {
    if (["Spring Retreat", "Fall Retreat"].includes(gameState.season)) {
        return resolveRetreat(boardSpec, gameState, orders);
    }
    if (["Spring", "Fall"].includes(gameState.season)) {
        return resolveAction(boardSpec, gameState, orders);
    }
    if (gameState.season === "Winter") {
        return resolveWinter(boardSpec, gameState, orders);
    }
};

module.exports = {
    resolve: resolve,
};
