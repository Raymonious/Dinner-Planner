import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import {h, render} from "vue";
import {installErrorFetch} from "./mockFetch.js";
import {doTests} from "./searchUtils.js";

let SearchPresenter;

const X = TEST_PREFIX;

try {
    SearchPresenter = require("../src/vuejs/" + X + "searchPresenter.js").default;
} catch (e) { }

const oldFetch= window.fetch;

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
            /*let reactPresenter;
            try{
            reactPresenter= require("../src/reactjs/" + X + "searchPresenter.js");
            }catch(e){}
            if(!reactPresenter)
            expect.fail("Either a React presenter or a Vue object presenter should be defined"); */
            this.skip();
        }
        installErrorFetch();
    });
    after(function tw3_2_20_after(){
        window.fetch=oldFetch;
        React.createElement=h;
    });

});
