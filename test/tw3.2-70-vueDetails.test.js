import { assert, expect } from "chai";
import {render, h} from "vue";

import {findDetailsEventName, makeRender, checkModelFetch} from "./detailsUtils.js";
import {installErrorFetch, withMyFetch, myDetailsFetch} from "./mockFetch.js";

import {dummyImgName} from "./searchUtils.js";

let DetailsPresenter;
const X = TEST_PREFIX;

try {
    DetailsPresenter = require("../src/vuejs/" + X + "detailsPresenter.js").default;
} catch (e) { }

const oldFetch= window.fetch;
describe("TW3.2 Vue resolve promise in component state, with side effect (Details presenter) [test](/tw2.5.1.html)", function tw_3_2_70() {
    this.timeout(200000);
    const React={createElement:h};
    
    before(async function tw_3_2_70_before() {        
        if (!DetailsPresenter  || typeof DetailsPresenter == "function") this.skip();
        installErrorFetch();
    });
    after(function tw_3_2_70_after(){
        window.fetch=oldFetch;
        React.createElement=h;
    });

    function checkAgainstModel(propsHistory, model, isInMenu){
        expect(propsHistory.slice(-1)[0].guests, "passed people should be the number of guests").to.equal(model.numberOfGuests);
        expect(propsHistory.slice(-1)[0].dishData?.id, "passed dish should be the data in the current dish promise state").to.equal(42);
        if(isInMenu)
            expect(propsHistory.slice(-1)[0].isDishInMenu, "isDishInMenu should be truthy if the displayed dish is in the menu").to.be.ok;
        else
            expect(propsHistory.slice(-1)[0].isDishInMenu, "isDishInMenu should be falsy if the displayed dish is not in the menu").to.not.be.ok;
    }

    it("DetailsPresenter renders 'no data' if current dish is falsy", async function tw3_2_70(){
        const propsHistory=[];
        makeRender(DetailsPresenter, React, render, h, {numberOfGuests:7, dishes:[{id:41}]}, propsHistory);
        await new Promise(resolve => setTimeout(resolve));

        
        expect(propsHistory.slice(-1)[0], "'no data' should be rendered when there is no current dish").to.equal("no promise, no data");
    });

    it("DetailsPresenter resolves a promise when the current dish is set", async function tw_3_2_70_2_1(){
        const propsHistory=[];
        const {vueModel}=await makeRender(DetailsPresenter, React, render, h, {numberOfGuests:7, dishes:[{id:41}]}, propsHistory);
        await withMyFetch(
            myDetailsFetch, 
            ()=>vueModel.model.currentDish= 42
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(propsHistory.slice(-2)[0], "an image should be rendered when there is no data").to.equal(dummyImgName);
        checkAgainstModel(propsHistory, vueModel.model);
    });

    it("DetailsPresenter updates when other relevent model data changes", async function tw_3_2_70_2_2(){
        const propsHistory=[];
        const {vueModel}=await makeRender(DetailsPresenter, React, render, h, {numberOfGuests:7, currentDish:42, dishes:[]}, propsHistory);
        
        vueModel.model.numberOfGuests=8;
        await new Promise(resolve=>setTimeout(resolve));
        checkAgainstModel(propsHistory, vueModel.model);

        vueModel.model.dishes=[{id:42}];
        await new Promise(resolve=>setTimeout(resolve));
        checkAgainstModel(propsHistory, vueModel.model, true);

        vueModel.model.dishes=[{id:43}];
        await new Promise(resolve=>setTimeout(resolve));
        checkAgainstModel(propsHistory, vueModel.model, false);
    });


    it("Details presenter handles custom event by adding to menu", async function tw_3_2_70_1(){
        let addedDish;
        const propsHistory=[];
        const {vueModel}=await makeRender(DetailsPresenter, React, render, h, {numberOfGuests:7, currentDish:42, dishes:[], addToMenu(x){addedDish=x;}}, propsHistory);
        const[add2Menu]=findDetailsEventName();

        
        expect(propsHistory.length, "DetailsView should be rendered when there is a current dish").to.be.ok;
        checkAgainstModel(propsHistory, vueModel.model);
        expect(propsHistory.slice(-1)[0][add2Menu], "custom event hanlder "+add2Menu+" must be a function").to.be.a("Function");

        propsHistory.slice(-1)[0][add2Menu]();
        expect(addedDish?.id, "custom event handler should call the appropriate model method").to.equal(42);
    });

    checkModelFetch();
});
