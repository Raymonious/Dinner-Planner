import { assert, expect } from "chai";
import React from "react";
import {render} from "react-dom";

import {findDetailsEventName, doTests} from "./detailsUtils.js";

let DetailsPresenter;
const X = TEST_PREFIX;

try {
    DetailsPresenter = require("../src/reactjs/" + X + "detailsPresenter.js").default;
} catch (e) { }

describe("TW3.2 React resolve promise in component state, side effect: Details  presenter (observer) [test](/tw3.2.3-react.html)", function tw_3_2_50() {
    this.timeout(200000);
    const h = React.createElement;
    
    before(async function tw_3_2_50_before() {        
        if (!DetailsPresenter) this.skip();
    });
    after(function tw_3_2_50_after(){
        React.createElement=h;
    });

    doTests(DetailsPresenter, React, render, h);

});
