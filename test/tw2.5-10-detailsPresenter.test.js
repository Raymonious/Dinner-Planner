import { assert, expect } from "chai";
import {findDetailsEventName} from "./detailsUtils.js";
import installOwnCreateElement from "./jsxCreateElement";
import createUI from './createUI.js';
const { render, h } = require('vue');
import {dishInformation} from "./mockFetch.js";
import makeModelProxyHandler from "./mockModel.js";

let DetailsPresenter;
let DetailsView;
const X = TEST_PREFIX;
try {
    DetailsPresenter = require("../src/vuejs/" + X + "detailsPresenter.js").default;
    DetailsView = require("../src/views/" + X + "detailsView.js").default;
} catch(e) { };

describe("TW2.5 Presenter passing props and custom events: DetailsPresenter [test](/tw2.5.1.html)", function tw2_5_10() {
  this.timeout(200000);

  before(function tw2_5_10_before(){
    if(!DetailsPresenter) this.skip();
  });

  it("Vue DetailsPresenter uses promiseNoData to determine whether to render DetailsView or not", async function tw2_5_10_1(){
    installOwnCreateElement();
      const renderingEmpty= DetailsPresenter({
          model: new Proxy(
              {
                  currentDish: dishInformation.id,
                  currentDishPromiseState:{},
              },
              makeModelProxyHandler("DetailsPresenter with no promise data"))
      });
      expect(renderingEmpty.children.length, "when there is no promise, DetailsPresenter should return a signle HTML element").to.equal(1);
      expect(renderingEmpty.children[0].toLowerCase(), "when there is no promise, DetailsPresenter should show 'no data'").to.equal("no data");
      
      const renderingPromise=DetailsPresenter(new Proxy({model: {currentDishPromiseState:{promise:"bla"}}},
                                                        makeModelProxyHandler("DetailsPresenter with no promise data")
                                                       ));
      expect(renderingPromise.tag, "when there is a promise but no data or error yet, DetailsPresenter should render a loading image").to.equal("img");
  });
    it("Vue DetailsPresenter renders DetailsView with props calculated from the model: guests, isDishInMenu, dishData", async function tw2_5_10_2(){
      installOwnCreateElement();
      const renderingData= DetailsPresenter({
          model: new Proxy({
              currentDishPromiseState:{promise:"bla", data: dishInformation},
              currentDish: dishInformation.id,
              dishes:[],
              numberOfGuests:4,
          }, makeModelProxyHandler("DetailsPresenter with promise data"))
      });
      expect(renderingData.tag).to.equal(DetailsView, "DetailsPresenter should render DetailsView if the promise state includes data");
      expect(renderingData.props.guests).to.equal(4, "DetailsView guest prop must be read from the model");
      expect(renderingData.props.isDishInMenu, "DetailsView isDishInMenu prop expected to be falsy with empty menu").to.not.be.ok;
      expect(renderingData.props.dishData).to.equal(dishInformation, "DetailsView dishData prop expected to be read from the currentDish promise state");
    });
    it("Vue DetailsPresenter handles custom event to add the dish to the menu", async function tw2_5_10_3(){
        installOwnCreateElement();
      let dishAdded;
      const renderingCustomEvent=DetailsPresenter({
          model: new Proxy({
              currentDishPromiseState:{promise:"bla", data: dishInformation},
              currentDish: dishInformation.id,
              dishes:[dishInformation],
              numberOfGuests:5,
              addToMenu(dish){
                  dishAdded=dish;
              },
              // these should not be used, but to avoid "Cannot read property of undefined" in Presnter or View code
              searchResultsPromiseState:{}          
          }, makeModelProxyHandler("DetailsPresenter with promise data, custom event test"))
      });
      expect(renderingCustomEvent.props.isDishInMenu, "DetailsView isDishInMenu prop expected to be truthy if the dish is in menu").to.be.ok;  
      expect(renderingCustomEvent.props.guests).to.equal(5, "DetailsView guest prop must be read from the model");

        const [addToMenu]=findDetailsEventName();
        expect(renderingCustomEvent.props[addToMenu], "expecting the custome event handler "+addToMenu+" to be a function").to.be.a("function");
        renderingCustomEvent.props[addToMenu]();
        expect(dishAdded, "expecting the custome event handler "+addToMenu+" to add a dish").to.deep.equal(dishInformation);
    });
});

