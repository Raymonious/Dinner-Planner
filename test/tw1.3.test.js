import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import createUI from "./createUI.js";
import installOwnCreateElement from "./jsxCreateElement.js";
import  {plusMinusEventName, removeEventName, currentDishEventName} from "./sidebarUtils.js";


let SidebarView;
let SummaryView;
let utilities;
const X= TEST_PREFIX;
try{
    utilities = require("/src/"+TEST_PREFIX+"utilities.js");
    SummaryView= require('../src/views/'+X+'summaryView.js').default;
    SidebarView= require('../src/views/'+X+'sidebarView.js').default;
}catch(e){};

const {render, h}= require("vue");

const {shoppingList, dishType, menuPrice}=utilities;


function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

describe("TW1.3 Array Rendering and basic CSS", function tw1_3() {
    this.timeout(200000);  // increase to allow debugging during the test run

    it("SummaryView table content [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)", function tw1_3_1(){
        if(!shoppingList ) this.skip();
        window.React={createElement:h};
        const ppl=3;

        // 3 dishes, 2 guests
        const div= createUI();
        const ingrList=shoppingList([getDishDetails(2), getDishDetails(100), getDishDetails(200)]);
        checkSummaryViewArrayRendering(SummaryView, ingrList, ppl, div, true)
        
        // 2 dishes, 2 guests
        const div2 = createUI();
        const ingrList2=shoppingList([getDishDetails(2), getDishDetails(100)]);
        checkSummaryViewArrayRendering(SummaryView, ingrList2, ppl, div2)

        // Function to check that the SummaryView renders correctly
        // Called mulitple times with different array sizes to test that array rendering is performed correctly
        function checkSummaryViewArrayRendering(SummaryView, ingrList,ppl, div, checkCSS=false) {
            const lookup=  ingrList.reduce(function(acc, ingr){ return {...acc, [ingr.name]:ingr}; }, {});
            render(<SummaryView people={ppl} ingredients={ingrList}/>, div);

            [...div.querySelectorAll("tr")].forEach(function(tr, index){
                const tds= tr.querySelectorAll("td");
                
                if(!tds.length){
                    expect(tr.querySelectorAll("th").length).to.equal(4);
                    expect(index).to.equal(0);  // must be first row
                    return;
                }
                expect(tds.length, "expecting 4 columns").to.equal(4);
                expect(lookup[tds[0].textContent.trim()], "expecting first column to show an ingredient name").to.be.ok;
                expect(lookup[tds[0].textContent.trim()].aisle).to.equal(tds[1].textContent.trim(), "aisle must be shown in column 2");
                expect(lookup[tds[0].textContent.trim()].unit).to.equal(tds[3].textContent.trim(), "measurement unit must be shown in last column");
                expect((lookup[tds[0].textContent.trim()].amount*ppl).toFixed(2)).to.equal(tds[2].textContent.trim(), "amount must be shown in column 3, multiplied by number of guests");
                expect(tds[2].textContent.trim()[tds[2].textContent.trim().length-3]).to.equal(".", "amount must be shown with two decimals, use (someExpr).toFixed(2)"); 
                document.body.lastElementChild.append(tds[2]); // we append the TD to the document, for style.css to take effect
                if(!checkCSS) return;
                try{
                    expect(window.getComputedStyle(tds[2])["text-align"]).to.equal("right", "align quantities to the right using CSS");
                }finally{
                    document.body.lastElementChild.firstChild.remove();
                }
            });
        }

    });

    it("SummaryView table order", function tw1_3_2(){
        if(!shoppingList ) this.skip();

        window.React={createElement:h};
        const div= createUI();
        const ingrList=shoppingList([getDishDetails(2), getDishDetails(100), getDishDetails(200)]);
        const ppl=3;
        render(<SummaryView people={ppl} ingredients={ingrList}/>, div);

        const [x,...rows]= [...div.querySelectorAll("tr")];  // ignore header
        expect(rows.length, "there should be as many table rows as ingredients").to.equal(ingrList.length);
        
        rows.forEach(function(tr, index){
            if(!index) return;
            const tds= tr.querySelectorAll("td");
            const prevTds= rows[index-1].querySelectorAll("td");
            if(tds[1].textContent.trim()===prevTds[1].textContent.trim())
                assert.operator(tds[0].textContent.trim(), ">=", prevTds[0].textContent.trim(), "when values in the 2nd column are equal, value in the first column must be larger than or equal to value in the row above");
            else
                assert.operator(tds[1].textContent.trim(), ">", prevTds[1].textContent.trim(), "value in the first column must be larger than or equal to value in the row above");
        });
    });
    
    it("SidearView table content [test UI with Vue](/tw1.3.html)[or React](/tw1.3-react.html)", function tw1_3_5(){
        if(!SidebarView) this.skip();
        window.React={createElement:h};
        const ppl=3;

        // 3 dishes, 3 guests
        const div= createUI();
        const dishes=[getDishDetails(2), getDishDetails(100), getDishDetails(200)];
        checkSidebarView(SidebarView, dishes, ppl, div);

        // 2 dishes, 3 guests
        const div2= createUI();
        const dishes2=[getDishDetails(100), getDishDetails(200)];
        checkSidebarView(SidebarView, dishes2, ppl, div2, true);

        function checkSidebarView(SidebarView, dishes, ppl, div, checkCSS=false) {
        const lookup =  dishes.reduce(function(acc, dish){ return {...acc, [dish.title]:{...dish, type: dishType(dish) }}; }, {});
        render(<SidebarView number={ppl} dishes={dishes}/>, div);
        
        const trs= div.querySelectorAll("tr");
        expect(trs.length, "there should be table rows for each dish, plus the row for the totals").to.equal(dishes.length+1);

        [...trs].forEach(function(tr, index, arr){
            const tds= tr.querySelectorAll("td");            
            expect(tds.length).to.equal(4, "dish table must have 4 columns");
            expect(tds[3].textContent.trim()[tds[3].textContent.trim().length-3]).to.equal(".", "price and total must be shown with two decimals, use (someExpr).toFixed(2)");            
            if(index==arr.length-1){
                expect(tds[3].textContent.trim()).to.equal((menuPrice(dishes)*ppl).toFixed(2), "last row must show total menu price multiplied by number of guests");
                return;
            }
            expect(lookup[tds[1].textContent.trim()], "second column must contain a dish name").to.be.ok;
            expect(lookup[tds[1].textContent.trim()].type).to.equal(tds[2].textContent.trim(), "3rd column must show dish type");
            expect((lookup[tds[1].textContent.trim()].pricePerServing*ppl).toFixed(2)).to.equal(tds[3].textContent.trim(), "last column must show total menu price multiplied by number of guests");

            expect(tds[1].firstElementChild?.nodeName, "dish name should be a HTML link (<a>)").to.equal("A");
            expect(tds[1].firstElementChild?.getAttribute("href"), "dish name HTML link should point to the same page (#) to prevent full page reload").to.equal("#");
            
            if(!checkCSS) return;
            document.body.append(tds[3]);
            try{  // we append the TD to the document, for style.css to take effect
                expect(window.getComputedStyle(tds[3])["text-align"]).to.equal("right", "align dish prices and total to the right using CSS");
            }finally{
                document.body.lastElementChild.remove();
            }  
        });
    }
    });

    it("SidebarView table order", function tw1_3_6(){
        if(!SidebarView) this.skip();
        window.React={createElement:h};
        const div= createUI();
        const ppl=3;
        const dishes=[getDishDetails(200), getDishDetails(100), getDishDetails(2), getDishDetails(1)];
        render(<SidebarView number={ppl} dishes={dishes}/>, div);


        const rows= [...div.querySelectorAll("tr")];  // ignore header
        expect(rows.length, "there should be table rows for each dish, plus the row for the totals").to.equal(dishes.length+1);

        const knownTypes= ["starter", "main course", "dessert"];
        rows.forEach(function(tr, index, arr){
            if(!index)return;
            if(index==arr.length-1) return;
            const tds= tr.querySelectorAll("td");
            const prevTds= rows[index-1].querySelectorAll("td");
            assert.operator(knownTypes.indexOf(tds[2].textContent.trim()), ">=", knownTypes.indexOf(prevTds[2].textContent.trim()), "expecting value in 3rd column to be bigger than or equal to the value on the row above");
        });
    });
    
});
