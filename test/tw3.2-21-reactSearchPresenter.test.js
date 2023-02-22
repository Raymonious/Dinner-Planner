import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import React from "react";
import {render} from "react-dom";
import {installErrorFetch} from "./mockFetch.js";

import {doTests} from "./searchUtils.js";


const h= React.createElement;

let SearchPresenter;

const X = TEST_PREFIX;

try {
    SearchPresenter = require("../src/reactjs/" + X + "searchPresenter.js").default;
} catch (e) { }

const oldFetch= window.fetch;

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
        installErrorFetch();
    });
    after(function tw3_2_20_after(){
        window.fetch=oldFetch;
        React.createElement=h;
    });

    doTests("React", h, render, React, function makeSearchRoot(model){return <Root model={model}/>;});
    
 

});
