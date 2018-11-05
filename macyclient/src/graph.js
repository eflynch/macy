let makeKey = (a, b) => [a, b].join(",");

class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = new Map();
        this.distances = new Map();
    }

    clone() {
        let g = new Graph();
        g.nodes = new Set(this.nodes);
        g.edges = new Map(this.edges);
        g.distances = new Map(this.distances);
        return g;
    }

    addNode(value){
        this.nodes.add(value);
    }

    removeNode(value){
        this.nodes.delete(value);
        this.edges.forEach((toNodes, fromNode) => {
            if (toNodes.has(value)) {
                toNodes.delete(value);
            }
            if (this.distances.has(makeKey(fromNode, value))) {
                this.distances.delete(makeKey(fromNode, value));
            }
            if (this.distances.has(makeKey(value, fromNode))) {
                this.distances.delete(makeKey(value, fromNode));
            }
        });
    }

    removeAllBut(nodes){
        for (let node of this.nodes) {
            if (!nodes.includes(node)){
                this.removeNode(node);
            }
        }
    }

    addEdge(fromNode, toNode, distance) {
        if (!this.nodes.has(fromNode)){
            console.warn(`Added edge for non-existant node ${fromNode} in ${fromNode}-${toNode}`);
            return;
        }
        if (!this.nodes.has(toNode)){
            console.warn(`Added edge for non-existant node ${toNode} in ${fromNode}-${toNode}`);
            return;
        }
        if (this.edges.has(fromNode)){
            this.edges.get(fromNode).add(toNode);
        } else {
            this.edges.set(fromNode, new Set([toNode]));
        }
        
        this.distances.set(makeKey(fromNode, toNode), distance);
    }

    removeEdge(fromNode, toNode) {
        if (this.edges.has(fromNode)){
            if (this.edges.get(fromNode).has(toNode)){
                this.edges.get(fromNode).delete(toNode);
                this.distances.delete(makeKey(fromNode, toNode));
            }
        }
    }

    getDistances(fromNode){
        return dijsktra(this, fromNode).visited;
    }

    distance(fromNode, toNode){
        let distanceAndPath = dijsktra(this, fromNode);
        if (distanceAndPath.visited.has(toNode)){
            return distanceAndPath.visited.get(toNode);
        } else {
            return undefined;
        }
    }
}

var dijsktra = function(graph, initial) {
    let visited = new Map();
    visited.set(initial, 0);
    let path = {};

    let nodes = new Set(graph.nodes);

    while(nodes) {
        let minNode = undefined;
        for (let node of nodes) {
            if (visited.has(node)) {
                if (minNode === undefined) {
                    minNode = node;
                } else if (visited.get(node) < visited.get(minNode)) {
                    minNode = node;
                }
            }
        }

        if (minNode === undefined) {
            break;
        }

        nodes.delete(minNode)
        let current_weight = visited.get(minNode);

        if (graph.edges.has(minNode)) {
            for (let toNode of graph.edges.get(minNode)) {
                let weight = current_weight + graph.distances.get(makeKey(minNode, toNode));
                if (!visited.has(toNode) || weight < visited.get(toNode)) {
                    visited.set(toNode, weight);
                    path[toNode] = minNode;
                }
            } 
        }
    }

    return {visited, path};
}
window.dijsktra = dijsktra;

module.exports = Graph;
