import React from 'react';

class KeyBindings extends React.PureComponent {
    render () {

        return (
            <div className="keybindings">
                <table>
                    <tr>
                        <th>Key</th>
                        <th>Action</th> 
                    </tr>
                    <tr>
                        <td>m</td>
                        <td>Move</td> 
                    </tr>
                    <tr>
                        <td>s</td>
                        <td>Support</td> 
                    </tr>
                    <tr>
                        <td>c</td>
                        <td>Convoy</td> 
                    </tr>
                    <tr>
                        <td>a</td>
                        <td>Build army</td> 
                    </tr>
                    <tr>
                        <td>f</td>
                        <td>Build fleet</td> 
                    </tr>
                    <tr>
                        <td>d</td>
                        <td>Disband</td> 
                    </tr>
                    <tr/>
                    <tr>
                        <td>n</td>
                        <td>Next Turn</td> 
                    </tr>
                    <tr>
                        <td>p</td>
                        <td>Previous Turn</td> 
                    </tr>
                    <tr>
                        <td>r</td>
                        <td>Resolve</td> 
                    </tr>
                    <tr>
                        <td>x</td>
                        <td>Revert</td> 
                    </tr>
                    <tr>
                        <td>/?</td>
                        <td>Toggle Help</td> 
                    </tr>
                </table>
            </div>
        );
    }
}

module.exports = KeyBindings;
