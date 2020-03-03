import React from 'react';

export default class SupplyCenters extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {show: null};
    }

    render () {
        let {gameState, boardSpec} = this.props;
        const factions = Object.keys(gameState.factions);
        return (
            <div className="supply-centers">
                {factions.map((faction) => {
                    let show = "";
                    if (this.state.show){
                        show = (
                            <div className="supply-center-item-list">
                                {gameState.factions[faction].supplyCenters.map((center)=><span>{center}</span>)}
                            </div>
                        );
                    }
                    return (
                        <div className="supply-center-item" key={faction} style={{background: boardSpec.factions[faction].color}} onClick={(e) => {
                                this.setState({show: !this.state.show});
                            }}>
                            <div className="supply-center-item-content">
                                <div className="supply-center-item-title">
                                    <span>{faction}</span>
                                    <span>{gameState.factions[faction].supplyCenters.length}</span>
                                </div>
                                {show}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
