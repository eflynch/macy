import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';

import Graph from './graph';
import App from './app';
import {session} from './game';

document.addEventListener("DOMContentLoaded", function (){
    render(<App session={session}/>, document.getElementById("content"));

});
