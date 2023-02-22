import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
import React from "react";
import {render} from "react-dom";
import {dishInformation, myDetailsFetch} from "./mockFetch.js";
import  {plusMinusEventName, removeEventName, currentDishEventName} from "./sidebarUtils.js";
import makeModelProxyHandler from "./mockModel.js";

let SidebarPresenter;
let SidebarView;
const X = TEST_PREFIX;

try {
    SidebarPresenter = require("../src/reactjs/" + X + "sidebarPresenter.js").default;
    SidebarView = require("../src/views/" + X + "sidebarView.js").default;
} catch (e) { }


describe("TW3.2 React Sidebar presenter (observer, component state, lifecycle) [test](/tw3.2.2-react.html)", function tw_3_2_40() {
    this.timeout(200000);

    const propsHistory=[];
    function Dummy(props){
        propsHistory.push(props);
        return <span>dummy view</span>;
    }
    const h = React.createElement;
    function replaceViews(tag, props, ...children){
        if(tag== SidebarView)
            return h(Dummy, props, ...children);
        return h(tag, props, ...children);
    };
    let turnOff;
    function Guard(props){
        const [state, setState]= React.useState(true);
        React.useEffect(()=> turnOff=()=>setState(false), []);
        return state && props.children;
    }
    
    let currentDishId;
    let removedDish;
    let nrGuests;
    
    let observers=[];
    let modelTarget;
    let added=0;
    let removed=0;
    const model=new Proxy(modelTarget={
        dishes: [dishInformation],
        numberOfGuests: 7,
        d(x){ this.dishes=x; },
        cd(x){ this.currentDish=x;},
        ng(x){ this.numberOfGuests=x;},
        addObserver(o){ added++; observers.push(o);},
        removeObserver(o){ removed++;observers.length=0;},
        setCurrentDish(id){ currentDishId=id; },
        removeFromMenu(dish){ removedDish=dish; },
        setNumberOfGuests(x){nrGuests=x;},
    },makeModelProxyHandler("React Sidebar Presenter"));
    
    function doRender(){
        const div= document.createElement("div");
        window.React=React;
        React.createElement= replaceViews;
        propsHistory.length=0;
        
        render(<Guard><SidebarPresenter model={model}/></Guard>, div);
        return div;
   }
    before(async function tw_3_2_40_before() {
        if (!SidebarPresenter) this.skip();
    });
    after(function tw_3_2_40_after(){
        React.createElement=h;
    });
    function checkAgainstModel(){
        expect(propsHistory.slice(-1)[0].number, "number prop passed to the SidebarView should update when the number of guests in the model updates").to.equal(model.numberOfGuests);
        expect(propsHistory.slice(-1)[0].dishes.map(d=>d.id), "dishes passed to the SidebarView should update when the dishes in the model update").to.eql(model.dishes.map(d=>d.id));

        if(!added)
            expect.fail("no observer was added");
        expect(added, "repeated observer additions, do you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
        expect(removed, "repeated observer removals, did you miss the second useEffect parameter?").to.equal(0);
    }
    
    it("Sidebar presenter renders view with initial correct props", async function tw_3_2_40_1(){
        doRender();
        await new Promise(resolve => setTimeout(resolve));
        expect(propsHistory.length, "no SidebarView was rendered").to.be.ok;
        checkAgainstModel();
        const[setCurrent, setNumber, remove]=[currentDishEventName(), plusMinusEventName(), removeEventName()];
        expect(propsHistory.slice(-1)[0][setCurrent], "cumstom event handler "+setCurrent+" must be a function").to.be.a("Function");
        expect(propsHistory.slice(-1)[0][setNumber], "custom event handler "+setNumber+" must be a function").to.be.a("Function");
        expect(propsHistory.slice(-1)[0][remove], "custom event handler "+remove+" must be a function").to.be.a("Function");

        const dish={id:42};
        propsHistory.slice(-1)[0][setCurrent](dish);
        expect(currentDishId, "custom event handler should call the appropriate model method").to.equal(42);

        propsHistory.slice(-1)[0][remove](dish);
        expect(removedDish, "custom event handler should call the appropriate model method").to.equal(dish);

        propsHistory.slice(-1)[0][setNumber](17);
        expect(nrGuests, "custom event handler should call the appropriate model method").to.equal(17);
    });

    it("Sidebar presenter updates view with correct props when relevant data changes in the model",  async function tw_3_2_40_2(){
        const {changeGuests, addDish, removeDish}=require("./payloadUtils.js");
        await new Promise(resolve => setTimeout(resolve));

        await changeGuests(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        await addDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        await removeDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
    });

    it("Sidebar presenter does not update unless relevant data changes in the model",  async function tw_3_2_40_5(){
        const {changeCurrentDish, dummyNotification, noCurrentDish}=require("./payloadUtils.js");
        await new Promise(resolve => setTimeout(resolve));

        await changeCurrentDish(modelTarget, observers, propsHistory, false);
        await noCurrentDish(modelTarget, observers, propsHistory, false);
        await dummyNotification(modelTarget, observers, propsHistory);
    });

    it("Sidebar presenter removes observer subscriptions at teardown", async  function tw_3_2_40_3(){
        turnOff();
        await new Promise(resolve => setTimeout(resolve));
        if(!added)
            expect.fail("no observer was added");
        expect(added, "repeated observer additions, did you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
        if(!removed)
            expect.fail("observer was not removed at teardown");
        expect(observers.length, "observers should be unsubscribed at teardown").to.equal(0);
    });
});
