import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';

import Graph from './graph';
import Board from './board';
import {resolve, boardSpec, gameState, orders} from './resolve';

document.addEventListener("DOMContentLoaded", function (){
    render(<Board boardSpec={boardSpec} gameState={gameState}/>, document.getElementById("content"));
    // resolve(boardSpec, gameState, orders);

});
