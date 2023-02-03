import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import createUI from "./createUI.js";
import installOwnCreateElement from "./jsxCreateElement.js";
import  {plusMinusEventName, removeEventName, currentDishEventName} from "./sidebarUtils.js";
import {dishInformation} from "./mockFetch.js";
import {findTag} from "./jsxUtilities.js";


let SidebarView;
const X= TEST_PREFIX;
try{
   SidebarView= require('../src/views/'+X+'sidebarView.js').default;
}catch(e){};

function clickEvent(){ return new Event("click",  {bubbles:true, cancellable:true}); }

describe("TW1.4 Handle native events, fire custom events [test events with Vue](/tw1.4.html)[or React](/tw1.4-react.html)", function tw1_4() {
    this.timeout(200000);  // increase to allow debugging during the test run

    before(function(){
        if(!SidebarView) this.skip();
    });

    it("SidebarView handles native events (click) on the - and + buttons", function tw1_4_1(){
        installOwnCreateElement();
        const rendering= SidebarView({number:4, dishes:[]});
        const buttons=findTag("button", rendering); 
        expect(buttons.length, "2 buttons expected if no dishes").to.equal(2);

        expect(buttons[0].props?.onClick, "onClick listener for - button must be a function (recommendation: initially log the number minus one)").to.be.a("Function");
        expect(buttons[1].props?.onClick, "onClick listener for + button must be a function (recommendation: initially log the number plus one)").to.be.a("Function");
        expect(buttons[0].props?.onClick,  "onClick listener + and - buttons must be different, because they do different things").to.not.equal(buttons[1].props?.onClick);
    });
    
    it("click on + or - buttons fire the  onNumberChange custom event with the desired number as parameter", function tw1_4_2(){
        installOwnCreateElement();
        let newNumber;
        const rendering= SidebarView({number:4, dishes:[], onNumberChange:function(nr){
            newNumber=nr;
        }});
        const buttons=findTag("button", rendering); 
        expect(buttons.length, "2 buttons expected if no dishes").to.equal(2);

        buttons[0].props?.onClick(clickEvent());
        expect(newNumber, "clicking the - button must fire the onNumberChange custom event with the new number value as parameter").to.equal(3);
        
        buttons[1].props?.onClick(clickEvent());
        expect(newNumber, "clicking the + button must fire the onNumberChange custom event with the new number value as parameter").to.equal(5);
    });


    
    it("SidebarView detects (native) click event on dish link", function tw1_4_3(){
        installOwnCreateElement();
        const dishes= [dishInformation, {...dishInformation, id:42}, {...dishInformation, id:43}];
        
        const rendering=SidebarView( {number:4, dishes});

        
        const links=findTag("a", rendering); 
        
        expect(links.length, "3 links expected for 3 dishes").to.equal(3);
        
        expect(links[0].props?.onClick, "onClick listener for dish links must be a function (recommendation: log the dish initially)").to.be.a("Function");
        expect(links[2].props?.onClick, "onClick listener for dish links must be a function (recommendation: log the dish initially)").to.be.a("Function");
        expect(links[0].props?.onClick,  "onClick listener for dish links must be a differnt function for each dish (define a CB nested in the array rendering CB)").to.not.equal(links[2].props?.onClick);
    });
    
    it("click on dish link fires a custom event and passes the dish object as parameter", function tw1_4_6(){
        currentDishEventName();
    });

    it("SidebarView detects (native) click event on dish link", function tw1_4_3(){
        installOwnCreateElement();
        const dishes= [dishInformation, {...dishInformation, id:42}, {...dishInformation, id:43}];
        
        const rendering=SidebarView( {number:4, dishes});
        
        const buttons=findTag("button", rendering); 
        
        expect(buttons.length, "5 buttons expected for 3 dishes: +, - and 3 x buttons").to.equal(5);
        
        expect(buttons[2].props?.onClick, "onClick listener for dish X button must be a function (recommendation: log the dish for )").to.be.a("Function");
        expect(buttons[4].props?.onClick, "onClick listener for dish X button must be a function (recommendation: log the dish initially)").to.be.a("Function");
        expect(buttons[2].props?.onClick,  "onClick listener for dish X buttons must be a differnt function for each dish (define a CB nested in the array rendering CB)").to.not.equal(buttons[4].props?.onClick);
    });
    
    
    it("click on dish X button fires a custom event and passes the dish object as parameter", function tw1_4_7(){
        const x=removeEventName();
        const y=currentDishEventName();
        expect(x, "custom event fired on clicking X button should be different from the custom event fired on clicking dish link").to.not.equal(y);
    });



});
