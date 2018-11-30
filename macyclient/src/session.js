import update from 'immutability-helper';  

import {OrderBuilder} from './order-builder';

import {resolve} from './logic/resolve';
import {loadBoardSpec} from './board-spec';
import {getJSON} from './web-utils';

const newSession = (title, boardSpecURI, callback) => {
    getJSON(boardSpecURI, (err, data) => {
        const session = {
            title: title,
            boardSpec: loadBoardSpec(boardSpec),
            turns: []
        };
        const boardSpec = loadBoardSpec(data);
        session.boardSpec = boardSpec;
        callback(session);
    });
}

const loadSession = (session, callback) => {
    const boardSpecURI = session.boardSpecURI;

    getJSON(session.boardSpecURI, (err, data) => {
        const boardSpec = loadBoardSpec(data);
        session.boardSpec = boardSpec;
        callback(session);
    });
}

const saveSession = (session) => {
    delete session.boardSpec;
    return session;
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
            orderState: this.orderBuilder.getState()
        };
    }
    getOrderBuilder = () => { return this.orderBuilder; }

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

    computeCurrentGameState = () => {
        return this.computeGameState(this.state.turn);
    }

    update = (hash) => {
        const newState = update(this.state, hash);
        this.state = newState;
        this.onMutate(this.getState());
    }

    getNumTurns = () => {
        return  this.session.turns.length + this.state.mutableTurns.length;
    }

    getTurns = () => {
        return this.session.turns.concat(this.state.mutableTurns);
    }

    setTurn = (turn) => {
        const clampedTurn = Math.min(this.getNumTurns() - 1, Math.max(0, turn));
        this.update({turn: {$set: clampedTurn}});
    }

    goForward = () => { this.setTurn(this.state.turn + 1); }

    goBack = () => { this.setTurn(this.state.turn - 1); }

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
        this.goForward();
    }

    tapTerritory = (territory) => {
        const gameState = this.computeCurrentGameState();
        const boardSpec = this.session.boardSpec;
        this.orderBuilder.tapTerritory(territory, gameState, boardSpec);
    }
}


module.exports = {
    newSession: newSession,
    loadSession: loadSession,
    saveSession: saveSession,
    SessionWrapper: SessionWrapper,
};
