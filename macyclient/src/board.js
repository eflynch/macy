import React from 'react';
import ReactDOM from 'react-dom';

class Unit extends React.PureComponent {
    render () {
        let {boardSpec, faction, unitType, size, territory} = this.props;
        let [x, y] = boardSpec.unitPositions[territory];
        return (
            <image href={boardSpec.factions[faction].unitImages[unitType]} x={x-size*0.5} y={y-size*0.5} width={size} height={size} />
        );
    }
}

class Build extends React.PureComponent {
    render () {
        let {boardSpec, faction, unitType, size, territory} = this.props;
        let [x, y] = boardSpec.unitPositions[territory];
        return (
            <g>
                <circle cx={x+2} cy={y+2} r={size * 0.5} style={{fillOpacity: 0.2, fill: "green"}}/>
                <image style={{opacity: 1.0}} href={boardSpec.factions[faction].unitImages[unitType]} x={x-size*0.5} y={y-size*0.5} width={size} height={size} />
            </g>
        );
    }
}

class Disband extends React.PureComponent {
    render () {
        let {boardSpec, size, territory} = this.props;
        let [x, y] = boardSpec.unitPositions[territory];
        return (
            <g>
                <line x1={x-size*0.5} y1={y-size*0.5} x2={x+size*0.5} y2={y+size*0.5} style={{stroke: "red", strokeWidth:12}} />
                <line x1={x-size*0.5} y1={y+size*0.5} x2={x+size*0.5} y2={y-size*0.5} style={{stroke: "red", strokeWidth:12}} />
            </g>
        );
    }
}

class Move extends React.PureComponent {
    render () {
        let {boardSpec, source, destination} = this.props;

        let [x1, y1] = boardSpec.unitPositions[source];
        let [x2, y2] = boardSpec.unitPositions[destination];

        return (
            <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "white", strokeWidth:12}} markerEnd="url(#arrow)"/>
            </g>
        );
    }
}

class Hold extends React.PureComponent {
    render () {
        let {boardSpec, territory, size} = this.props;

        let [x, y] = boardSpec.unitPositions[territory];

        return (
            <g>
                <circle cx={x+2} cy={y+2} r={size * 0.5} style={{stroke: "white", fillOpacity: 0, strokeWidth:5}}/>
            </g>
        );
    }
}

class SupportMove extends React.PureComponent {
    render () {
        let {boardSpec, source, destination, supporter} = this.props;

        let [x1, y1] = boardSpec.unitPositions[source];
        let [x2, y2] = boardSpec.unitPositions[destination];
        let [x3, y3] = boardSpec.unitPositions[supporter];

        return (
            <g>
                <line x1={x3} y1={y3} x2={(x1 + x2)/2} y2={(y1+y2)/2} style={{stroke: "white", strokeWidth:4}}/>
                <line x2={x2} y2={y2} x1={(x1 + x2)/2} y1={(y1+y2)/2} style={{stroke: "white", strokeWidth:4}}/>
            </g>
        );
    }
}

class SupportHold extends React.PureComponent {
    render () {
        let {boardSpec, supporter, targetUnit} = this.props;

        let [x1, y1] = boardSpec.unitPositions[supporter];
        let [x2, y2] = boardSpec.unitPositions[targetUnit];

        return (
            <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "white", strokeWidth:4}}/>
            </g>
        );
    }
}

class Convoy extends React.PureComponent {
    render () {
        let {boardSpec, convoyer, source, destination, size} = this.props;

        let [x, y] = boardSpec.unitPositions[convoyer];
        let [x1, y1] = boardSpec.unitPositions[source];
        let [x2, y2] = boardSpec.unitPositions[destination];

        return (
            <g>
                <path d={`m${x - size * 0.5} ${y + size * 0.5} ${` s ${size * 0.05} 14, ${size * 0.1} 0`.repeat(10)}`}  style={{stroke: "rgba(0, 0, 255, 0.8)", fillOpacity: 0, strokeWidth:12}}/>
                 <line x1={x} y1={y} x2={(x1 + x2)/2} y2={(y1+y2)/2} style={{stroke: "rgba(0, 0, 255, 0.8)", strokeWidth:4}}/>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "rgba(0, 0, 255, 0.2)", strokeWidth:60, strokeLinecap:"round"}}/>
            </g>
        );
    }
}


class Board extends React.Component {
    render () {
        let {boardSpec, gameState, orders, selectedTerritory, orderMode} = this.props;
        const factions = Object.keys(gameState.factions);
        const unitTypes = ["army", "fleet"];
        let units = [];
        for (let faction of factions) {
            for (let unitType of unitTypes) {
                for (let territory of gameState.factions[faction][unitType]) {
                    units.push(<Unit unitType={unitType} key={territory + faction + unitType} boardSpec={boardSpec} faction={faction} size={100} territory={territory}/>);
                }
            }
        }

        let underTokens = orders.map((order, i) => {
            if (order.action === "Move") {
                return <Move key={i} boardSpec={boardSpec} source={order.unit} destination={order.target} />;
            }
            if (order.action === "Hold") {
                return <Hold key={i} boardSpec={boardSpec} territory={order.unit} size={100}/>;
            }
            if (order.action === "Convoy") {
                return <Convoy key={i} boardSpec={boardSpec} convoyer={order.unit} source={order.targetUnit} destination={order.target} size={100}/>;
            }
            if (order.action === "Support" && (order.target !== null && order.target !== undefined)) {
                return <SupportMove key={i} boardSpec={boardSpec} supporter={order.unit} source={order.targetUnit} destination={order.target}/>;
            }
            if (order.action === "Support" && (order.target === null || order.target === undefined)) {
                return <SupportHold key={i} boardSpec={boardSpec} supporter={order.unit} targetUnit={order.targetUnit} />;
            }
            if (order.action === "Build") {
                return <Build key={i} boardSpec={boardSpec} territory={order.unit} unitType={order.unitType} size={100} faction={order.power}/>;
            }
            if (order.action === "Disband") {
                return <Disband key={i} boardSpec={boardSpec} territory={order.unit} size={100}/>;
            }
            return false;
        }).filter((order)=>order);

        let overTokens = orders.map((order, i) => {
            if (order.action === "Build") {
                return <Build key={i} boardSpec={boardSpec} territory={order.unit} unitType={order.unitType} size={100} faction={order.power}/>;
            }
            if (order.action === "Disband") {
                return <Disband key={i} boardSpec={boardSpec} territory={order.unit} size={100}/>;
            }
            return false;
        }).filter((order)=>order);

        let territories = [];
        let transform="translate(0.000000,2250.000000) scale(0.100000,-0.100000)";
        
        let fleetSelected = false;
        let armySelected = false;
        if (selectedTerritory) {
            for (let faction of factions) {
                if (gameState.factions[faction].fleet.includes(selectedTerritory)) {
                    fleetSelected = true;
                    break;
                }
                if (gameState.factions[faction].army.includes(selectedTerritory)) {
                    armySelected = true;
                    break;
                }
            }
        }

        let all_territories = Object.keys(boardSpec.unitPositions);
        // If we have a fleet selected but not in convoy orderMode, do not add non-coastal variants
        if (fleetSelected && orderMode != "convoy"){
            all_territories = all_territories.filter(t => !boardSpec.multiCoast.includes(t));
        // If we have an army selected or in convoy orderMode, do not add coastal variants
        } else if (armySelected || orderMode == "convoy"){
            all_territories = all_territories.filter(t => !t.includes("::"));

        // If we have nothing selected, add coastal graphs only in territories where fleets are
        } else {
            all_territories = all_territories.filter(t => {
                if (t.includes("::")) {
                    for (let faction of factions) {
                        if (gameState.factions[faction].fleet.includes(t)) {
                            return true;
                        }
                    }
                    return false;
                } else if (boardSpec.multiCoast.includes(t)) {
                    for (let faction of factions) {
                        for (let territory of gameState.factions[faction].fleet) {
                            if (territory.includes(t)){
                                return false;
                            }
                        }
                    }
                    return true;
                }
                return true;
            });
        }
        for (let territory of all_territories) {
            const filePath = territory.toLowerCase().replace(/\./g, "").replace(/ /g, "-").replace("-::-", "-coast-");
            if (boardSpec.territoryPaths[filePath] !== undefined) {
                let isSelected = selectedTerritory === territory;

                territories.push(
                    <g className={`territory${isSelected ? " selected": ""}`} onClick={()=>{this.props.clickTerritory(territory);}} key={territory +"path"} transform={transform}>
                        {boardSpec.territoryPaths[filePath].map((p, i)=><path key={i} d={p}/>)}
                    }}
                    </g>
                );
            }
        }


        const arrowWidth = 12;
        const arrowHeight = 3;
            
        return (
            <div className="board">
                <svg ref={d=>this.svgDiv=d} width="100%" height="100%" viewBox={`0 0 ${boardSpec.boardSize[0]} ${boardSpec.boardSize[1]}`}>
                    <defs>
                        <marker id="arrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX={arrowWidth / 2 - 1} refY={arrowHeight / 2} orient="auto" markerUnits="strokeWidth">
                            <path d={`M0,0 L0,${arrowHeight} L${arrowWidth / 2},${arrowHeight / 2} z`} fill="#fff" />
                        </marker>
                    </defs>
                    <image href={boardSpec.boardImage} x="0" y="0"></image>
                    {territories}
                    <g className="tokens">
                        {underTokens}
                        </g>
                    <g className="units">
                        {units}
                    </g>
                    <g className="tokens">
                        {overTokens}
                    </g>
                </svg>
            </div>
        );
    }
}


module.exports = Board;
