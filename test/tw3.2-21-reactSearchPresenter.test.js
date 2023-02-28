import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import React from "react";
import {render} from "react-dom";

import {doTests} from "./searchUtils.js";


const h= React.createElement;

let SearchPresenter;

const X = TEST_PREFIX;

try {
    SearchPresenter = require("../src/reactjs/" + X + "searchPresenter.js").default;
} catch (e) { }

/* version until 2023.02.20 was assuming that Vue search presenter uses component state. We may want to come back to that */
describe("TW3.2 React Search presenter [test](/tw3.2.1-react.html)", function tw3_2_20() {
    this.timeout(200000);

    
    function Root(props){
        return <SearchPresenter model={props.model}/>;
    };


    before(async function tw3_2_20_before() {
        if (!SearchPresenter){
            this.skip();
        }
    });
    after(function tw3_2_20_after(){
        React.createElement=h;
    });

    doTests("React", h, render, React, function makeSearchRoot(model){return <Root model={model}/>;});
    
 

});
