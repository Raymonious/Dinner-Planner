
import { assert, expect } from "chai";
import {withMyFetch, myDetailsFetch} from "./mockFetch.js";
import {dummyImgName} from "./searchUtils.js";
import {useState, useEffect, createElement} from "react";
import {h, createApp} from "vue";

const X = TEST_PREFIX;

function makeCreateElement(framework, h){
    const propsHistory=[];
    
    function Dummy(props){
        propsHistory.push({... props});
        return <span>dummy {props.type}</span>;
    }
    return {replacePresenters:function(tag, props, ...children){
        if(tag==require("../src/"+framework+"/" + X + "searchPresenter.js").default)
            return h(Dummy, {...props, type:"search"});
        if(tag==require("/src/"+framework+"/" + X + "sidebarPresenter.js").default)
            return h(Dummy, {...props, type:"sidebar"});
        if(tag==require("/src/"+framework+"/" + X + "detailsPresenter.js").default)
            return h(Dummy, {...props, type:"details"});
        if(tag==require("/src/"+framework+"/" + X + "summaryPresenter.js").default)
            return h(Dummy, {...props, type:"summary"});
        if(tag=="img") {
            return h(Dummy, {...props, type:"imgLoader"});
        }
        if(tag=="div" && children && children[0] && (""+children[0]).toLowerCase()=="no data")
            return h(Dummy, {...props, type:"no data"});
        return h(tag, props, ...children);
    },
            propsHistory
           };
}

async function testVue(theTest){
    require("./mockFirebase.js").initDB();
    const {replacePresenters, propsHistory} = makeCreateElement("vuejs", h);

    window.React={createElement:replacePresenters};

    let VueRootAll;
    try {
        VueRootAll = require("../src/vuejs/" + X + "VueRoot.js");
    } catch (e) {  }

    if(!VueRootAll?.VueRoot || !VueRootAll?.router)
        return false;
    
    const div= document.createElement("div");
    window.location.hash="pursposefully_wrong_route";   // force rendering of just Sidebar
    const app= createApp(VueRootAll.VueRoot);

    await withMyFetch(myDetailsFetch, function(){
        app.use(VueRootAll.router);
        app.mount(div);
    });
    const result= await theTest(propsHistory);
    app.unmount();
    if(result===false)
        return false;
    return true;
}

async function testReact(theTest){
    require("./mockFirebase.js").initDB();
    const {replacePresenters, propsHistory} = makeCreateElement("reactjs", createElement);

    window.React={createElement:replacePresenters};
    
    let ReactRoot;
    try {
        ReactRoot = require("../src/reactjs/" + X + "ReactRoot.js").default;
    } catch (e) { } 
    if(!ReactRoot)
        return false;

    let turnOff;

    function Guard(){
        const[guard, setGuard]= useState(true);
        turnOff= function(){setGuard(false); };
        return guard && <ReactRoot/>;
    }
    const div= document.createElement("div");
    await withMyFetch(myDetailsFetch, function(){
        window.React={createElement:replacePresenters};
        window.location.hash="pursposefully_wrong_route";   // force rendering of just Sidebar
        require("react-dom").render(<Guard/>, div);
    });

    const result= await theTest(propsHistory);
    turnOff();
    if(result===false)
        return false;
    return true;
}

async function testRoutes(propsHistory){
    expect(propsHistory.length, "Root should render other components").to.be.ok;
    // we assume that here we have a wrong route, so Sidebar is rendered
                
    expect(propsHistory.slice(-1)[0]?.type).to.equal("sidebar");
    
    window.location.hash="/";
    await new Promise(resolve=>setTimeout(resolve));
    expect(propsHistory.slice(-1)[0]?.type).to.equal("search");
    
    window.location.hash="/details";
    await new Promise(resolve=>setTimeout(resolve));
    expect(propsHistory.slice(-1)[0]?.type).to.equal("details");
    
    window.location.hash="/summary";
    await new Promise(resolve=>setTimeout(resolve));
    expect(propsHistory.slice(-1)[0]?.type).to.equal("summary");
    
    window.location.hash="/search";
    await new Promise(resolve=>setTimeout(resolve));
    expect(propsHistory.slice(-1)[0]?.type).to.equal("search");

}


async function testSuspense(propsHistory){
    const {state, findPersistencePropNames}=require("./mockFirebase.js");
    const x= findPersistencePropNames();
    if(!x)
        return false;
    const {numberOfGuests, dishes, currentDish}= x;
    
    expect(propsHistory.length, "Root should render the initial promise: first no data, then an image, then the app").to.be.gte(3);
    expect(propsHistory[0].type, "the root component will briefly render 'no data' before the lifecycle executes").to.equal("no data");
    expect(propsHistory[1].type, "the root component will render a loading image (suspense) while the persistence promise is resolved").to.equal("imgLoader");
    expect(propsHistory[2].model?.numberOfGuests, "the model passed to the presenters contains the data from the cloud (nr guests)").to.equal(state.data[numberOfGuests]);
    expect(propsHistory[2].model?.currentDish, "the model passed to the presenters contains the data from the cloud (current dish)").to.equal(state.data[currentDish]);
    expect(propsHistory[2].model?.dishes.map(d=>d.id), "the model passed to the presenters contains the data from the cloud (dishes)").to.eql(state.data[dishes]);
}


export {testReact, testVue, testRoutes, testSuspense};
