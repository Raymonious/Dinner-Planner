import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import {h, render} from "vue";
import {doTests} from "./searchUtils.js";

let SearchPresenter;

const X = TEST_PREFIX;

try {
    SearchPresenter = require("../src/vuejs/" + X + "searchPresenter.js").default;
} catch (e) { }

describe("TW3.2 Vue object Search presenter [same test as TW2.5](/tw2.5.2.html)", function tw3_2_20() {
    this.timeout(200000);
 
    const Root={
        props: ["model"],
        data(){ return {rootModel:this.model};},
        render(){
            return <SearchPresenter model={this.rootModel}/>;
        },
    };

    doTests("Vue", h, render, {}, function makeSearchRoot(model){return <Root model={model}/>;});

    before(async function tw3_2_20_before() {
        if (!SearchPresenter || typeof SearchPresenter == "function"){
            this.skip();
        }
    });
    after(function tw3_2_20_after(){
        React.createElement=h;
    });

});
