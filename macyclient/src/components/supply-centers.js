import React, { useState } from 'react';

const SupplyCenters = ({gameState, boardSpec}) => {
    const [show, setShow] = useState(null);

    const factions = Object.keys(gameState.factions);
    return (
        <div className="supply-centers">
            {factions.map((faction) => {
                let show = "";
                if (show){
                    show = (
                        <div className="supply-center-item-list">
                            {gameState.factions[faction].supplyCenters.map((center)=><span>{center}</span>)}
                        </div>
                    );
                }
                return (
                    <div className="supply-center-item" key={faction} style={{background: boardSpec.factions[faction].color}} onClick={(e) => {
                        setShow(!show);
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
};