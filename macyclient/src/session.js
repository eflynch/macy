import update from 'immutability-helper';  

import {OrderBuilder} from './order-builder';

import {getAllowedOrderModes} from './game/utils';
import {resolve} from './game/resolve';
import {LoadBoardSpecFromSerializable} from './board-spec';
import {getJSON} from './web-utils';

const NewSession = (title, serializableBoardSpec) => {
    return {
        title: title,
        boardSpec: LoadBoardSpecFromSerializable(serializableBoardSpec),
        turns: []
    };
}

const LoadSessionFromSerializable = (serializableSession, callback) => {
    getJSON(serializableSession.boardSpecURI, (err, serializableBoardSpec) => {
        const clone = JSON.parse(JSON.stringify(serializableSession));
        const boardSpec = LoadBoardSpecFromSerializable(serializableBoardSpec);
        clone.boardSpec = boardSpec;
        callback(clone);
    });
}

const SaveSessionToSerializable = (session) => {
    const clone = JSON.parse(JSON.stringify(boardSpec));
    delete clone.boardSpec;
    return clone;
}


class SessionWrapper {
    constructor(session, onMutate) {
        this.session = session;
        this.state = {
            mutableTurns: [[]],
            turn: session.turns.length
        };

        this.gameStateCache = {};

        if (onMutate){
            this.onMutate = onMutate;
        } else {
            this.onMutate = (newState)=>{};
        }

        // Forward orderbuilder state through session wrapper
        this.orderBuilder = new OrderBuilder(() => {
            this.onMutate(this.getState());
        });
    }

    getState = () => {
        return {
            turnState: this.state,
            orderState: this.orderBuilder.getState(),
            gameState: this.getCurrentGameState(),
            session: this.session
        };
    }

    setOrderMode = (orderMode) => {
        const gameState = this.getCurrentGameState();
        const allowedOrderModes = getAllowedOrderModes(gameState.season);
        if (allowedOrderModes.includes(orderMode)) {
            this.orderBuilder.setMode(orderMode);
        }
    }

    computeGameState = (turn) => {
        if (this.gameStateCache[turn] === undefined) {
            const boardSpec =  this.session.boardSpec;
            const turns = this.session.turns.concat(this.state.mutableTurns);

            let gameState;
            if (turn === 0) {
                gameState = JSON.parse(JSON.stringify(boardSpec.startingGameState));
            } else {
                gameState = this.computeGameState(turn - 1);
                gameState = resolve(boardSpec, gameState, turns[turn - 1]);
            }
            this.gameStateCache[turn] = gameState;
        }
        return this.gameStateCache[turn];
    }

    getCurrentGameState = () => {
        return this.computeGameState(this.state.turn);
    }

    update = (hash) => {
        const newState = update(this.state, hash);
        this.state = newState;

        // Update orderMode if not valid
        const gameState = this.getCurrentGameState();
        const allowedOrderModes = getAllowedOrderModes(gameState.season);
        if (!allowedOrderModes.includes(this.orderBuilder.getState().orderMode)) {
            // this takes care of the onMutate
            this.orderBuilder.setMode(allowedOrderModes[0]);
        } else {
            this.onMutate(this.getState());
        }
    }

    setTurn = (turn) => {
        const numTurns = this.session.turns.length + this.state.mutableTurns.length;
        const clampedTurn = Math.min(numTurns - 1, Math.max(0, turn));
        this.update({turn: {$set: clampedTurn}});
    }

    revertToCurrentTurn = () => {
        // Only revert mutable turns
        if (this.state.turn <  this.session.turns.length){
            return;
        }

        // Invalidate cache for all turns after and including this.state.turn
        for (let cacheTurn of Object.keys(this.gameStateCache)) {
            if (cacheTurn >= this.state.turn){
                this.gameStateCache[cacheTurn] = undefined;
            }
        }

        const mutableTurnIdx = this.state.turn -  this.session.turns.length;
        const finalOrders = this.state.mutableTurns[mutableTurnIdx];
        this.orderBuilder.loadOrders(finalOrders);
        this.update({
            mutableTurns : {
                length : {$set: mutableTurnIdx + 1},
                [mutableTurnIdx]: {
                    length: {$set: 0}
                }
            }
        });
    }

    resolveOrders = () => {
        const turns = this.session.turns.concat(this.state.mutableTurns);
        const hasNoOrdersYet = turns[this.state.turn].length === 0;
        if (!hasNoOrdersYet || this.state.turn != turns.length - 1) {
            return;
        }

        const orders = Object.values(this.orderBuilder.getState().orders);
        const turnToModify = this.state.mutableTurns.length - 1;

        this.orderBuilder.clearOrders();
        this.update({
            mutableTurns: {
                [turnToModify] : { $push: orders},
                $push: [[]]
            }
        });
        this.setTurn(this.state.turn + 1);
    }

    tapTerritory = (territory) => {
        const gameState = this.getCurrentGameState();
        const boardSpec = this.session.boardSpec;
        this.orderBuilder.tapTerritory(territory, gameState, boardSpec);
    }
}


module.exports = {
    NewSession: NewSession,
    LoadSessionFromSerializable: LoadSessionFromSerializable,
    SaveSessionToSerializable: SaveSessionToSerializable,
    SessionWrapper: SessionWrapper,
};
