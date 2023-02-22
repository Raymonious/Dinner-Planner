import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import createUI from "./createUI.js";

import installOwnCreateElement from "./jsxCreateElement.js";

const {render, h}= require("vue");

let SummaryView;
let SidebarView;

const X= TEST_PREFIX;
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

describe("TW1.2 Basic Rendering", function tw1_2() {
    this.timeout(200000);  // increase to allow debugging during the test run
    

    it("SummaryView shows its people prop [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)", function tw1_2_1(){
        const div= createUI();
        window.React={createElement:h};
        render(<SummaryView people={4} ingredients={[]} />, div);
        assert.equal(div.firstElementChild.firstElementChild.firstChild.textContent, "4", "SummaryView should show its people prop, in this case, 4");
    });

    it("SummaryView does not change its props during rendering", function tw1_2_2(){
        if(typeof SummaryView !="function") this.skip();
        const props = {people: 4, ingredients: []};
        const json = JSON.stringify(props);
        const rendering= SummaryView(props);
        expect(JSON.stringify(props),"SummaryView doesn't change its props during render").to.equal(json);
    });

    it("SidebarView shows its number prop [test UI with Vue](/tw1.2.1.html)[or React](/tw1.2.1-react.html)", function tw1_2_3(){
        if(!SidebarView) this.skip();
        let div= createUI();
        window.React={createElement:h};
        render(<SidebarView number={4} dishes={[]}/>, div);
        assert.equal(div.querySelectorAll("button").length, 2, "SidebarView should have only 2 buttons");
        assert.equal(div.querySelectorAll("button")[0].disabled, false, "SidebarView's first button should be enabled");
        assert.equal(div.querySelectorAll("button")[0].firstChild.textContent, "-", "SidebarView's first button should have text '-'");
        assert.equal(div.querySelectorAll("button")[1].firstChild.textContent, "+", "SidebarView's second button should have text '+'");
        assert.equal(div.querySelectorAll("button")[0].nextSibling.textContent, "4", "SidebarView should show its number prop, in this case, 4");

    });
    it("SidebarView minus button should be disabled if number prop is 1 (test above ^^^)", function tw1_2_4(){
        if(!SidebarView) this.skip();
        let div= createUI();
        window.React={createElement:h};
        render(<SidebarView number={1} dishes={[]}/>, div);
        assert.equal(div.querySelectorAll("button").length, 2, "SidebarView should have only 2 buttons");
        assert.equal(div.querySelectorAll("button")[0].firstChild.textContent, "-", "SidebarView's first button should have text '-'");
        assert.equal(div.querySelectorAll("button")[0].disabled, true, "SidebarView's first button should be disabled");
        assert.equal(div.querySelectorAll("button")[1].firstChild.textContent, "+", "SidebarView's second button should have text '+'");
        assert.equal(div.querySelectorAll("button")[0].nextSibling.textContent, "1", "SidebarView should show its number prop, in this case, 1");
        
    });

   it("SidebarView does not change its props during rendering", function tw1_2_5(){
        if(!SidebarView || typeof SidebarView !="function") this.skip();
        installOwnCreateElement();
        const props = {number: 4, dishes: []};
        const json = JSON.stringify(props);
        const rendering= SidebarView(props);
        expect(JSON.stringify(props),"SidebarView doesn't change its props during render").to.equal(json);

    });
});
