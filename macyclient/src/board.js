import React from 'react';
import ReactDOM from 'react-dom';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: '0', height: '0' };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: Math.min(window.innerWidth, 800), height: window.innerHeight });
    };

    render () {
        let {boardSpec, gameState} = this.props;
        const factions = Object.keys(gameState.factions);
        let units = [];
        for (let faction of factions) {
            for (let fleet of gameState.factions[faction].fleet) {
                let [x, y] = boardSpec.unitPositions[fleet];
                units.push(<image key={fleet} href={boardSpec.factions[faction].fleetImage} x={x-50} y={y-50} width={100} height={100}/>);
            }
            for (let army of gameState.factions[faction].army) {
                let [x, y] = boardSpec.unitPositions[army];
                units.push(<image key={army} href={boardSpec.factions[faction].armyImage} x={x-50} y={y-50}  width={100} height={100}/>);
            }
        }
        return (
            <div className="board">
                <svg ref={d=>this.svgDiv=d} width={this.state.width} height={this.state.height} viewBox={`0 0 ${boardSpec.boardSize[0]} ${boardSpec.boardSize[1]}`}>
                    <image href={boardSpec.boardImage} x="0" y="0">
                    </image>
                    {units}
                </svg>
            </div>
        );
    }
}


module.exports = Board;
