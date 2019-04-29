import Graph from './graph';

module.exports = {
    LoadBoardSpecFromSerializable: (boardSpec) => {
        for (let graphType of Object.keys(boardSpec.graph)) {
            boardSpec.graph[graphType] = Graph.fromSimple(boardSpec.graph[graphType]);
        }
        return boardSpec;
    },
    SaveBoardSpecToSerializable: (boardSpec) => {
        const clone = JSON.parse(JSON.stringify(boardSpec));
        for (let graphType of Object.keys(boardSpec.graph)) {
            clone.graph[graphType] = Graph.toSimple(boardSpec.graph[graphType]);
        }
        return clone
    }
};
