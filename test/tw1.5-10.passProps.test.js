import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import createUI from "./createUI.js";
import installOwnCreateElement from "./jsxCreateElement.js";
import makeModelProxyHandler from "./mockModel.js";



let SidebarView;
let SummaryView;
let Sidebar;
let utilities;
const X= TEST_PREFIX;
try{
    utilities = require("/src/"+TEST_PREFIX+"utilities.js");
    SidebarView= require('../src/views/'+X+'sidebarView.js').default;
    SummaryView= require('../src/views/'+X+'summaryView.js').default;
    Sidebar= require('../src/vuejs/'+X+'sidebarPresenter.js').default;
}catch(e){};

const {render, h}= require("vue");

const {shoppingList, dishType, menuPrice}=utilities;


function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

describe("TW1.5 Pass props from Presenter to View", function tw1_5_10() {
    this.timeout(200000);  // increase to allow debugging during the test run

    it("Vue Summary presenter renders SummaryView with people prop [test UI](/tw1.5.html)", function tw_1_5_10_1(){
        let Summary;
        let SummaryView;
        try{
        Summary= require('../src/vuejs/'+TEST_PREFIX+'summaryPresenter.js').default;
        SummaryView= require('../src/views/'+TEST_PREFIX+'summaryView.js').default;
        }catch(e){console.log(e);};

        installOwnCreateElement();
        let rendering=Summary({model: new Proxy({numberOfGuests:2, dishes:[]}, makeModelProxyHandler("Summary presenter"))   });

        expect(rendering.tag).to.be.ok;
        expect(rendering.tag.name).to.equal(SummaryView.name);
        expect(rendering.props).to.be.ok;
        expect(rendering.props.people, "people prop passed to SummaryView should be the Model number of guests").to.equal(2);

        rendering=Summary({model: new Proxy({numberOfGuests:3, dishes:[]}  , makeModelProxyHandler("Summary presenter"))     });
        expect(rendering.tag).to.be.ok;
        expect(rendering.tag.name).to.equal(SummaryView.name);
        expect(rendering.props).to.be.ok;
        expect(rendering.props.people, "people prop passed to SummaryView should be the Model number of guests").to.equal(3);
    });

        
    it("Vue Summary presenter passes ingredients prop (shopping list, must pass a non empty array to enable)", function tw1_5_10_2(){
        if(!shoppingList) this.skip();
        installOwnCreateElement();
        const dishes= [getDishDetails(1), getDishDetails(100), getDishDetails(201)];
        const model= {numberOfGuests:3, dishes};
        let Summary;
        try {
        Summary= require('../src/vuejs/'+TEST_PREFIX+'summaryPresenter.js').default;
        } catch(e){console.log(e);};
        const rendering=Summary({model});
        if(rendering.props.ingredients.length == 0) this.skip();
        
        expect(rendering.tag).to.equal(SummaryView);
        expect(rendering.props).to.be.ok;
        expect(rendering.props.people).to.equal(3);
        expect(rendering.props.ingredients).to.deep.equal(shoppingList(dishes));
    });
    
    it("Vue Sidebar presenter renders SidebarView with number prop  [test UI](/tw1.5.1.html)", function tw_1_5_10_3(){
        if(!SidebarView || !Sidebar) this.skip();
        installOwnCreateElement();
        let rendering=Sidebar({model:  new Proxy({numberOfGuests:2, dishes:[]} , makeModelProxyHandler("Sidebar presenter"))   });

        expect(rendering.tag).to.be.ok;
        expect(rendering.tag.name).to.equal(SidebarView.name);
        expect(rendering.props).to.be.ok;
        expect(rendering.props.number, "number prop passed to SidebarView should the Model number of guests").to.equal(2);

        rendering=Sidebar({model:  new Proxy({numberOfGuests:5, dishes:[]},  makeModelProxyHandler("Sidebar presenter")) });

        expect(rendering.tag).to.be.ok;
        expect(rendering.tag.name).to.equal(SidebarView.name);
        expect(rendering.props).to.be.ok;
        expect(rendering.props.number, "number prop passed to SidebarView should the Model number of guests").to.equal(5);
    });

    it("Vue Sidebar presenter passes dishes prop", function tw1_5_10_4(){
      if(!SidebarView || !Sidebar) this.skip();
        installOwnCreateElement();
        const dishes= [getDishDetails(1), getDishDetails(100), getDishDetails(201)];
        const model= {numberOfGuests:3, dishes};
        
        const rendering= Sidebar({model});

        expect(rendering.tag,  "expecting sidebar presenter to render SidebarView").to.equal(SidebarView);
        expect(rendering.props,  "expecting sidebar presenter to pass props to SidebarView").to.be.ok;
        expect(rendering.props.dishes, "expecting sidebar presenter to pass the correct dishes prop").to.deep.equal(dishes);
    });
});