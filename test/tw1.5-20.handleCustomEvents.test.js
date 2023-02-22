import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import createUI from "./createUI.js";
import installOwnCreateElement from "./jsxCreateElement.js";
import  {plusMinusEventName, removeEventName, currentDishEventName} from "./sidebarUtils.js";
import makeModelProxyHandler from "./mockModel.js";


let SidebarView;
let Sidebar;
const X= TEST_PREFIX;

try{
    utilities = require("/src/"+X+"utilities.js");
    Sidebar= require('../src/vuejs/'+X+'sidebarPresenter.js').default;
}catch(e){};

try{
    SummaryView= require('../src/views/'+X+'summaryView.vue').default;
}catch(e){
    try{
        SummaryView= require('../src/views/'+X+'summaryView.js').default;
    }catch(e){}
}

try{
    SidebarView= require('../src/views/'+X+'sidebarView.vue').default;
}catch(e){
    try{
        SidebarView= require('../src/views/'+X+'sidebarView.js').default;
    }catch(e){}
}

const {render, h}= require("vue");


function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

describe("TW1.5 Presenter handles custom events and changes Model (Vue sidebar) [final TW1 test](/tw1.5.2.html)", function tw1_5_20() {
    this.timeout(200000);  // increase to allow debugging during the test run

    before(function tw1_5_20_before(){
        if(!SidebarView || !Sidebar) this.skip();
    });


    it("presenter handles the onNumberChange custom event, changing the number of guests in the Model", function tw_1_5_20_1(){
        installOwnCreateElement();
        let latestGuests;
        const rendering=Sidebar({
            model: new Proxy({
                numberOfGuests:2,
                dishes:[],
                setNumberOfGuests(x){ latestGuests=x; }
            } , makeModelProxyHandler("Sidebar presenter, testing custom events")) 
        });
        
        expect(typeof rendering.props.onNumberChange).to.equal("function");
        // we can apply the callback, the model should change!
        rendering.props.onNumberChange(3);
        expect(latestGuests, "custom event should properly ask presenter to change guests").to.equal(3);
        rendering.props.onNumberChange(5);
        expect(latestGuests, "custom event should properly ask presenter to change guests").to.equal(5);
        
    });

    it("presenter handles the apropriate custom event fired by the View, setting current dish in the Model", function tw1_5_20_2(){
        const setCurrent=currentDishEventName();
        installOwnCreateElement();
        const dishes= [getDishDetails(1), getDishDetails(100), getDishDetails(201)];
        let latestCurrentDish;
        let latestRemovedDish;
        const model= {
            numberOfGuests:3,
            dishes,
            setCurrentDish(id){
                latestCurrentDish=id;
            },
            removeFromMenu(dish){
                latestRemovedDish=dish;
            }
            
        };
        
        const rendering= Sidebar({model});
        
        expect(rendering.tag, "expecting sidebar presenter to render SidebarView").to.equal(SidebarView);
        expect(rendering.props, "expecting sidebar presenter to pass props to SidebarView").to.be.ok;

        expect(rendering.props[setCurrent], "custom event handler "+setCurrent+ " should be a function").to.be.a("function");
        rendering.props[setCurrent](getDishDetails(1));
        expect(latestCurrentDish,"custom event handler "+setCurrent+ " should set the current dish").to.equal(1);
        expect(latestRemovedDish, "custom event handler "+setCurrent+" should not remove dish").to.be.undefined;
    });
       
    it("presenter handles the apropriate custom event fired by the View, removing the dish from the Model menu", function tw1_5_20_3(){
           const remove=removeEventName();
        installOwnCreateElement();
        const dishes= [getDishDetails(1), getDishDetails(100), getDishDetails(201)];
        let latestCurrentDish;
        let latestRemovedDish;
        const model= {
            numberOfGuests:3,
            dishes,
            setCurrentDish(id){
                latestCurrentDish=id;
            },
            removeFromMenu(dish){
                latestRemovedDish=dish;
            }
            
        };
        const rendering= Sidebar({model});

        expect(rendering.props[remove], "custom event handler "+remove+" should be a function").to.be.a("function");
        rendering.props[remove](getDishDetails(2));
        expect(latestRemovedDish,"custom event handler "+remove+" should remove a dish").to.deep.equal(getDishDetails(2));
        expect(latestCurrentDish, "custom event handler "+remove+" should not set current dish").to.be.undefined;
    });

});
