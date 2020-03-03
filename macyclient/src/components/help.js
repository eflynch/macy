import React from 'react';

let HelpSection = (props) => {
    return (
        <div style={{padding: 10}}>
            {props.children}
        </div>
    );
}

export default class Help extends React.PureComponent {
    render () {
        return (
            <div className="help">
                <h1>Help</h1>
                <p style={{maxWidth:800}}>
                    This an online implementation of a well-known classic game of international intrigue.
                    Please send any complaints directly to the President of the United States.
                    Contact the author, Evan Lynch, with praise or gifts.
                    View the source on GitHub <a href="https://github.com/eflynch/macy">here</a>.
                </p>
                <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", maxHeight:1000}}>
                    <HelpSection>
                        <h2>Making Orders</h2>
                        <p style={{maxWidth:400}}>
                            Select an order type from the list (or with keyboard as below).
                            Each order can be made with mouse clicks on the board as detailed below.
                        </p>
                        <table>
                            <tr>
                                <th>Key</th>
                                <th>Action</th>
                                <th>How to</th>
                            </tr>
                            <tr>
                                <td>m</td>
                                <td>Move*</td> 
                                <td>Select unit, destination</td>
                            </tr>
                            <tr>
                                <td>v</td>
                                <td>Move (Convoy)*</td> 
                                <td>Select unit, destination</td>
                            </tr>
                            <tr>
                                <td>s</td>
                                <td>Support</td> 
                                <td>Select unit, unit to support, destination</td>
                            </tr>
                            <tr>
                                <td>c</td>
                                <td>Convoy</td> 
                                <td>Select unit, unit to convoy, destination</td>
                            </tr>
                            <tr>
                                <td>a</td>
                                <td>Build army</td> 
                                <td>Select build point</td>
                            </tr>
                            <tr>
                                <td>f</td>
                                <td>Build fleet</td> 
                                <td>Select build point</td>
                            </tr>
                            <tr>
                                <td>d</td>
                                <td>Disband</td> 
                                <td>Select unit to disband</td>
                            </tr>
                            <tr>
                                <td>q</td>
                                <td>Retreat</td> 
                                <td>Select unit, destination</td>
                            </tr>
                        </table>
                        <p style={{maxWidth: 400}}>
                            * Move and Move (Convoy) are separate actions in this implementation because there are edge cases where specifying whether or not an army is to be moved by convoy is ambiguous potentially allowing an enemy to "convoynap" an army allowing units to trade places.
                        </p>
                    </HelpSection>
                    <HelpSection>
                        <h2>Saving State</h2>
                        <p style={{maxWidth:400}}>
                            "save" will copy the current game state (all orders so far) to the clipboard in a JSON format.
                        </p>
                        <p style={{maxWidth:400}}>
                            "load" will load a game state from the clipboard following the same schema.
                        </p>
                        <p style={{maxWidth:400}}>
                            Any game loaded from the clipboard is fully mutable. However, the game loaded at page-load is only mutable beyond the length of the
                                game played so far. To modify the earlier part of the game, load
                                a new game from the clipboard. 
                        </p>
                    </HelpSection>
                    <HelpSection>
                        <h2>Additional Keyboard Shortcuts</h2>
                        <table>
                            <tr>
                                <td>n</td>
                                <td>View next turn</td>
                            </tr>
                            <tr>
                                <td>p</td>
                                <td>View previous turn</td> 
                            </tr>
                            <tr>
                                <td>r</td>
                                <td>Resolve current turn</td> 
                            </tr>
                            <tr>
                                <td>x</td>
                                <td>Revert game to turn in view</td> 
                            </tr>
                            <tr>
                                <td>l</td>
                                <td>Load session from clipboard</td> 
                            </tr>
                            <tr>
                                <td>w</td>
                                <td>Save session to clipboard</td>
                            </tr>
                            <tr>
                                <td>?</td>
                                <td>Toggle help</td> 
                            </tr>
                        </table>
                    </HelpSection>
                </div>
            </div>
        );
    }
}
