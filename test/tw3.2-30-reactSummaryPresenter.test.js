import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import React from "react";
import {render} from "react-dom";
import {dishInformation} from "./mockFetch.js";
import makeModelProxyHandler from "./mockModel.js";

let SummaryPresenter;
let SummaryView;
let utilities;
const X = TEST_PREFIX;

try {
    SummaryPresenter = require("../src/reactjs/" + X + "summaryPresenter.js").default;
    SummaryView = require("../src/views/" + X + "summaryView.js").default;
    utilities= require('../src/'+TEST_PREFIX+'utilities.js');
} catch (e) { }


describe("TW3.2 React Summary presenter (observer, component state, lifecycle) [test](/tw3.2.2-react.html)", function tw3_2_30() {
    this.timeout(200000);

    const propsHistory=[];
    function Dummy(props){
        propsHistory.push(props);
        return <span>dummy view</span>;
    }
    const h = React.createElement;
    function replaceViews(tag, props, ...children){
        if(tag==SummaryView)
            return h(Dummy, props, ...children);
        return h(tag, props, ...children);
    };
    let turnOff;
    function Guard(props){
        const [state, setState]= React.useState(true);
        React.useEffect(()=> turnOff=()=>setState(false), []);
        return state && props.children;
    }
    
    let observers=[];
    let modelTarget;
    let removed=0;
    let added=0;
    const model= new Proxy(modelTarget={
        dishes: [dishInformation],
        numberOfGuests: 7,
        d(x){ this.dishes=x; },
        cd(x){ this.currentDish=x;},
        ng(x){ this.numberOfGuests=x;},
        addObserver(o){ added++; observers.push(o);},
        removeObserver(o){ removed++; observers.length=0;}
    }, makeModelProxyHandler("React Summary presenter"));
    
    function doRender(){
        const div= document.createElement("div");
        window.React=React;
        React.createElement= replaceViews;
        propsHistory.length=0;
        
        render(<Guard><SummaryPresenter model={model}/></Guard>, div);
        return div;
    }
    before(async function tw3_2_30_before () {
        if (!SummaryPresenter) this.skip();
    });
    after(function tw3_2_30_after(){
        React.createElement=h;
    });
    it("Summary presenter renders view with correct initial props", async function tw3_2_30_1(){
        const {shoppingList}= utilities;
        doRender();
        await new Promise(resolve => setTimeout(resolve));
        expect(propsHistory.length, "no SummaryView was rendered").to.be.ok;

        checkAgainstModel();
    });

    function checkAgainstModel(){
        const {shoppingList}= utilities;
        expect(propsHistory.slice(-1)[0].ingredients, "passed ingredients should be the shopping list").to.eql(shoppingList(modelTarget.dishes));
        expect(propsHistory.slice(-1)[0].people, "passed people should be the number of guests").to.equal(modelTarget.numberOfGuests);

        if(!added)
            expect.fail("no observer was added");
        expect(added, "repeated observer additions, do you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
        expect(removed, "repeated observer removals, did you miss the second useEffect parameter?").to.equal(0);
    }
    
    it("Summary presenter updates view with correct props if relevant data changes in the model",  async function tw3_2_30_2(){
        const {changeGuests, addDish, removeDish}=require("./payloadUtils.js");
        await new Promise(resolve => setTimeout(resolve));

        await changeGuests(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        await addDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        await removeDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
    });

    it("Summary presenter does not update if unrelated data changes in the model",  async function tw_3_2_30_5(){
        const {changeCurrentDish, dummyNotification, noCurrentDish}=require("./payloadUtils.js");
        await new Promise(resolve => setTimeout(resolve));

        await changeCurrentDish(modelTarget, observers, propsHistory, false);
        await noCurrentDish(modelTarget, observers, propsHistory, false);
        await dummyNotification(modelTarget, observers, propsHistory);
    });


    it("Summary presenter removes observer subscriptions at teardown", async  function tw3_2_30_3(){
        turnOff();
        await new Promise(resolve => setTimeout(resolve));  
        expect(observers.length, "observers should be unsubscribed at teardown").to.equal(0);
        if(!added)
            expect.fail("no observer was added");
        expect(added, "repeated observer additions, did you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
        if(!removed)
            expect.fail("observer was not removed at teardown");
        expect(removed, "repeated observer removals, did you miss the second useEffect parameter?").to.equal(1);
    });
});
