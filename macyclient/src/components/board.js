import React from 'react';

import MouseFollower from './mouse-follower';
import utils from '../game/utils';

class Unit extends React.PureComponent {
    render () {
        let {boardSpec, faction, unitType, size, territory} = this.props;
        let [x, y] = boardSpec.unitPositions[territory];
        return (
            <image xlinkHref={boardSpec.factions[faction].unitImages[unitType]} x={x-size*0.5} y={y-size*0.5} width={size} height={size} />
        );
    }
}

class DislodgedUnit extends React.PureComponent {
    render () {
        let {boardSpec, faction, unitType, size, territory, restriction} = this.props;
        let [x, y] = boardSpec.unitPositions[territory];
        return (
            <g>
                <circle cx={x+2} cy={y+2} r={size * 0.5} style={{fillOpacity: 0.3, fill: "red"}}/>
                <image style={{opacity: 0.3}} xlinkHref={boardSpec.factions[faction].unitImages[unitType]} x={x-size*0.5} y={y-size*0.5} width={size} height={size} />
            </g>
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
                <image style={{opacity: 1.0}} xlinkHref={boardSpec.factions[faction].unitImages[unitType]} x={x-size*0.5} y={y-size*0.5} width={size} height={size} />
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
                <line x1={x-size*0.5} y1={y-size*0.5} x2={x+size*0.5} y2={y+size*0.5} style={{stroke: "red", strokeWidth:12 * boardSpec.boardSize[1] / 2250}} />
                <line x1={x-size*0.5} y1={y+size*0.5} x2={x+size*0.5} y2={y-size*0.5} style={{stroke: "red", strokeWidth:12 * boardSpec.boardSize[1] / 2250}} />
            </g>
        );
    }
}

class Move extends React.PureComponent {
    render () {
        let {boardSpec, source, destination, viaConvoy} = this.props;

        let [x1, y1] = boardSpec.unitPositions[source];
        let [x2, y2] = boardSpec.unitPositions[destination];

        let color = viaConvoy ? "blue" : "white";
        let markerEnd = viaConvoy ? "url(#barrow)" : "url(#warrow)";

        return (
            <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: color, strokeWidth:12 * boardSpec.boardSize[1] / 2250}} markerEnd={markerEnd}/>
            </g>
        );
    }
}

class Retreat extends React.PureComponent {
    render () {
        let {boardSpec, source, destination, viaConvoy} = this.props;

        let [x1, y1] = boardSpec.unitPositions[source];
        let [x2, y2] = boardSpec.unitPositions[destination];

        return (
            <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "red", strokeWidth:12 * boardSpec.boardSize[1] / 2250}} markerEnd={"url(#rarrow)"}/>
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
                <line x1={x3} y1={y3} x2={(x1 + x2)/2} y2={(y1+y2)/2} style={{stroke: "white", strokeWidth:4 * boardSpec.boardSize[1] / 2250}}/>
                <line x2={x2} y2={y2} x1={(x1 + x2)/2} y1={(y1+y2)/2} style={{stroke: "white", strokeWidth:4 * boardSpec.boardSize[1] / 2250}}/>
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
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "white", strokeWidth:4 * boardSpec.boardSize[1] / 2250}}/>
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
                 <line x1={x} y1={y} x2={(x1 + x2)/2} y2={(y1+y2)/2} style={{stroke: "rgba(0, 0, 255, 0.8)", strokeWidth:4 * boardSpec.boardSize[1] / 2250}}/>
                <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "rgba(0, 0, 255, 0.2)", strokeWidth:60 * boardSpec.boardSize[1] / 2250, strokeLinecap:"round"}}/>
            </g>
        );
    }
}


export default class Board extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            hoverTerritory: undefined
        };
    }

    enterTerritory = (territory) => {
        this.setState({
            hoverTerritory: territory
        });
    };

    render () {
        const {boardSpec, gameState, orders, orderState} = this.props;
        const factions = Object.keys(gameState.factions);
        const unitTypes = ["army", "fleet"];
        let units = [];
        const size = 100 * boardSpec.boardSize[1] / 2250;
        for (let faction of factions) {
            for (let unitType of unitTypes) {
                for (let territory of gameState.factions[faction][unitType]) {
                    units.push(<Unit unitType={unitType} key={territory + faction + unitType} boardSpec={boardSpec} faction={faction} size={size} territory={territory}/>);
                }
            }
        }

        let dislodgements = [];
        for (let dislodgement of gameState.dislodged) {
            dislodgements.push(<DislodgedUnit unitType={dislodgement.unitType} key={dislodgement.source + "dislodged"} territory={dislodgement.source} faction={dislodgement.faction} size={120} restriction={dislodgement.restriction} boardSpec={boardSpec}/>);
        }
        let underTokens = orders.map((order, i) => {
            if (order.action === "Move") {
                return <Move key={i} boardSpec={boardSpec} source={order.unit} destination={order.target} viaConvoy={order.viaConvoy} />;
            }
            if (order.action === "Hold") {
                return <Hold key={i} boardSpec={boardSpec} territory={order.unit} size={size}/>;
            }
            if (order.action === "Convoy") {
                return <Convoy key={i} boardSpec={boardSpec} convoyer={order.unit} source={order.targetUnit} destination={order.target} size={size}/>;
            }
            if (order.action === "Support" && (order.target !== null && order.target !== undefined)) {
                return <SupportMove key={i} boardSpec={boardSpec} supporter={order.unit} source={order.targetUnit} destination={order.target}/>;
            }
            if (order.action === "Support" && (order.target === null || order.target === undefined)) {
                return <SupportHold key={i} boardSpec={boardSpec} supporter={order.unit} targetUnit={order.targetUnit} />;
            }
            if (order.action === "Build") {
                return <Build key={i} boardSpec={boardSpec} territory={order.unit} unitType={order.unitType} size={size} faction={order.faction}/>;
            }
            if (order.action === "Disband") {
                return <Disband key={i} boardSpec={boardSpec} territory={order.unit} size={size}/>;
            }
            if (order.action === "Retreat") {
                return <Retreat key={i} boardSpec={boardSpec} source={order.unit} destination={order.target} size={size}/>;
            }
            return false;
        }).filter((order)=>order);

        let overTokens = orders.map((order, i) => {
            if (order.action === "Build") {
                return <Build key={i} boardSpec={boardSpec} territory={order.unit} unitType={order.unitType} size={size} faction={order.faction}/>;
            }
            if (order.action === "Disband") {
                return <Disband key={i} boardSpec={boardSpec} territory={order.unit} size={size}/>;
            }
            return false;
        }).filter((order)=>order);

        let territories = [];
        let transform=`translate(0.000000,${boardSpec.boardSize[1]}.000000) scale(0.100000,-0.100000)`;

        let all_territories = Object.keys(boardSpec.unitPositions);
        let tappableTerritories = utils.getTappableTerritories(boardSpec, gameState, orderState);
        for (let territory of all_territories) {
            const filePath = territory.toLowerCase().replace(/\./g, "").replace(/ /g, "-").replace("-::-", "-coast-");
            if (boardSpec.territoryPaths[filePath] === undefined) {
                console.warn("Missing path for ", filePath);
                continue;
            }

            // Skip coasts unless they are clickable
            let strippedTerritory = utils.stripCoast(territory);
            if (boardSpec.multiCoast[strippedTerritory] !== undefined) {
                // If coast is clickable, then not-coast should be skipped
                if (strippedTerritory === territory) {  // i.e. we are a not a coast
                   let atleastOneCoastIsClickable = boardSpec.multiCoast[utils.stripCoast(territory)].some((coast) => {
                        return tappableTerritories.includes(`${strippedTerritory} :: ${coast}`)
                    });
                    if (atleastOneCoastIsClickable) {
                        continue;
                    } 

                // skip all coasts unless they are clickable
                } else {
                    if (!tappableTerritories.includes(territory)) {
                        continue;
                    }
                }
            }

            let isSelected = orderState.unit === territory;
            let clickable = tappableTerritories.includes(territory);

            let className = `territory${isSelected ? " selected": ""}${clickable ? " clickable": ""}`;

            territories.push(
                <g className={className}
                    onClick={()=>{
                        if (clickable){
                            this.props.clickTerritory(territory);
                        } else {
                            this.props.clickTerritory(undefined);
                        }
                    }}
                    onMouseEnter={()=>{this.enterTerritory(territory);}}
                    onMouseLeave={()=>{this.enterTerritory(null);}}
                    key={territory +"path"} transform={transform}>
                    {boardSpec.territoryPaths[filePath].map((p, i)=><path key={i} d={p}/>)}
                }}
                </g>
            );
        }


        const arrowWidth = 12 * boardSpec.boardSize[1] / 2250;
        const arrowHeight = 3;

        let partialOrder;
        switch (orderState.orderMode) {
        case "Convoy":
        case "Support":
            if (!orderState.unit){
                partialOrder = utils.makeOrder(undefined, this.state.hoverTerritory, undefined, undefined, orderState.orderMode);
            } else if (!orderState.targetUnit) {
                partialOrder = utils.makeOrder(undefined, orderState.unit, this.state.hoverTerritory, undefined, orderState.orderMode);
            } else {
                partialOrder = utils.makeOrder(undefined, orderState.unit, orderState.targetUnit, this.state.hoverTerritory, orderState.orderMode);
            }
            break;
        case "Move":
        case "Move (Convoy)":
        case "Retreat":
            if (!orderState.unit){
                partialOrder = utils.makeOrder(undefined, this.state.hoverTerritory, undefined, undefined, orderState.orderMode);
            } else {
                partialOrder = utils.makeOrder(undefined, orderState.unit, orderState.targetUnit, this.state.hoverTerritory, orderState.orderMode);
            }
            break;
        case "Build Fleet":
        case "Build Army":
        case "Disband":
            partialOrder = utils.makeOrder(undefined, undefined, undefined, this.state.hoverTerritory, orderState.orderMode);
            break;
        }
        let mouseFollower = (
            <div className="mouseFollower">
                {utils.formatOrder(partialOrder)}
            </div>
        );

        if (this.state.hoverTerritory === null && !orderState.unit && !orderState.targetUnit) {
            mouseFollower = <span/>;
        }

        return (
            <MouseFollower className="board" follower={mouseFollower} follow={false}>
                <svg ref={d=>this.svgDiv=d} width="100%" height="100%" viewBox={`0 0 ${boardSpec.boardSize[0]} ${boardSpec.boardSize[1]}`}>
                    <defs>
                        <marker id="warrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX={arrowWidth / 2 - 1} refY={arrowHeight / 2} orient="auto" markerUnits="strokeWidth">
                            <path d={`M0,0 L0,${arrowHeight} L${arrowWidth / 2},${arrowHeight / 2} z`} fill="#fff" />
                        </marker>
                        <marker id="barrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX={arrowWidth / 2 - 1} refY={arrowHeight / 2} orient="auto" markerUnits="strokeWidth">
                            <path d={`M0,0 L0,${arrowHeight} L${arrowWidth / 2},${arrowHeight / 2} z`} fill="#00f" />
                        </marker>
                        <marker id="rarrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX={arrowWidth / 2 - 1} refY={arrowHeight / 2} orient="auto" markerUnits="strokeWidth">
                            <path d={`M0,0 L0,${arrowHeight} L${arrowWidth / 2},${arrowHeight / 2} z`} fill="#f00" />
                        </marker>
                    </defs>
                    <image xlinkHref={boardSpec.boardImage} x="0" y="0" width={boardSpec.boardSize[0]} height={boardSpec.boardSize[1]}></image>
                    {territories}
                    <g className="tokens">
                        {underTokens}
                        </g>
                    <g className="units">
                        {units}
                        {dislodgements}
                    </g>
                    <g className="tokens">
                        {overTokens}
                    </g>
                </svg>
            </MouseFollower>
        );
    }
}
