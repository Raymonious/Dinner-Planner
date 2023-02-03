import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";
const { render, h } = require("vue");
import {findFormEventNames, findResultsEventName}from "./searchUtils.js";
import makeModelProxyHandler from "./mockModel.js";

let SearchPresenter;
let SearchFormView;
let SearchResultsView;
const X = TEST_PREFIX;

import {searchResults} from "./mockFetch.js";

try {
  SearchPresenter = require("../src/vuejs/" + X + "searchPresenter.js").default;
  SearchFormView = require("../src/views/" + X + "searchFormView.js").default;
  SearchResultsView = require("../src/views/" + X + "searchResultsView.js").default;
} catch (e) { }

describe("TW2.5 Presenter passing props and handling custom events: Search [test](/tw2.5.2.html) [Final TW2 test](/tw2.5.3.html#search)", function tw2_5_20() {
  this.timeout(200000);

  before(function tw2_5_20_before() {
    if (!SearchPresenter || !SearchFormView || !SearchResultsView) this.skip();
    if (typeof SearchPresenter == "object") this.skip();
  });

  it("Vue SearchPresenter passes dishTypeOptions prop to SearchFormView", function tw2_5_20_3() {
    installOwnCreateElement();
      let searched, text, type;
      let searchPars;
      let dummyModel;
    const renderingCustomEvent = SearchPresenter({
        model: dummyModel= new Proxy({
          searchResultsPromiseState: { promise: "foo" },
          searchParams:{query:"some test Query", type:"test Type"},
          doSearch(params){searched = true; searchPars=params;},
          setSearchQuery(txt){text = txt;},
          setSearchType(t){type = t;},
        },makeModelProxyHandler("Search presenter rendered with dish data, testing SearchFormViuew custom events"))
    });
      expect(renderingCustomEvent.children.length, "Search presenter should render at least one child (the search form)").to.be.ok;

    const searchFormViewProps = renderingCustomEvent.children[0].props;
    expect(searchFormViewProps, "The SearchFormView should have props").to.be.ok;
    expect(searchFormViewProps,"SearchFormView is missing prop dishTypeOptions").to.have.property("dishTypeOptions");
    expect(JSON.stringify(searchFormViewProps["dishTypeOptions"]), "the options passed are not correct").to.equal(JSON.stringify(["starter", "main course", "dessert"]));

  });
    
  it("Vue SearchPresenter passes the searchResults prop calculated from Model search promise state to SearchResultsView", function tw2_5_20_4() {
      installOwnCreateElement();
      let dishId;
      const renderingSearchResults = SearchPresenter({
          model: new Proxy({
              searchResultsPromiseState: { promise: "foo", data: "bar" },
              setCurrentDish(id) {dishId = id;},
          },makeModelProxyHandler("Search presenter rendered with data, testing SearchResultsView custom events"))
      });
      expect(renderingSearchResults.children.length, "Search presenter should render two children (search form and search results)").to.equal(2);
      const searchResultsViewProps = renderingSearchResults.children[1].props;
      expect(searchResultsViewProps, "prersenter should pass props to SearchResutlsView").to.be.ok;
      expect(searchResultsViewProps, "SearchResultsView is missing a prop").to.have.property("searchResults");
      expect(searchResultsViewProps["searchResults"]).to.equal("bar", "searchResults prop does not equal data in promise");
  });

    it("Vue SearchPresenter handles custom events fired by SearchFormView", function tw2_5_20_3() {
       const [onTextHandler, onDishTypeHandler, onSearchHandler]= findFormEventNames();
        installOwnCreateElement();
        let searched, text, type;
        let searchPars;
        let dummyModel;
        const renderingCustomEvent = SearchPresenter({
            model: dummyModel= new Proxy({
                searchResultsPromiseState: { promise: "foo" },
                searchParams:{query:"some test Query", type:"test Type"},
                doSearch(params){searched = true; searchPars=params;},
                setSearchQuery(txt){text = txt;},
                setSearchType(t){type = t;},
            },makeModelProxyHandler("Search presenter rendered with dish data, testing SearchFormViuew custom events"))
        });
        expect(renderingCustomEvent.children.length, "Search presenter should render at least one child (the search form)").to.be.ok;
        expect(renderingCustomEvent.children[0].tag).to.equal(SearchFormView, "expected first search presenter child to be SearchFormView");

        const searchFormViewProps = renderingCustomEvent.children[0].props;
        // testing event handlers
        
        expect(searchFormViewProps[onTextHandler], `custom event handler ${onTextHandler} should be a function`).to.be.a("function");
        expect(text, "did not expect model method to be called during Search rendering,  did you pass a function as custom event handler?").to.not.be.ok;
        searchFormViewProps[onTextHandler]("some test search query");
        expect(text, "custom event handler "+onTextHandler+" should change search query in the model").to.equal("some test search query");
        
        expect(searchFormViewProps[onDishTypeHandler], `custom event handler ${onDishTypeHandler} should be a function`).to.be.a("function");
        expect(type, "did not expect model method to be called during Search rendering,  did you pass a function as custom event handler?").to.not.be.ok
        searchFormViewProps[onDishTypeHandler]("some test search type");
        expect(type, "custom event handler "+onDishTypeHandler+" should change search type in the model").to.equal("some test search type");
        
        expect(searchFormViewProps[onSearchHandler], `custom event handler ${onSearchHandler} should be a function`).to.be.a("function");
        expect(searched, "did not expect model method to be called during Search rendering, did you pass a function as custom event handler?").to.not.be.ok;
        searchFormViewProps[onSearchHandler]();      
        expect(searched, "custom event handler "+onSearchHandler+" should trigger search in the model").to.equal(true);
        expect(searchPars, "custom event handler "+onSearchHandler+" should trigger search in the model with the parameters filled in by the user").to.deep.equal(dummyModel.searchParams);

        expect(Object.keys(searchFormViewProps).length, "expected 4 props in total for the searchFormView").to.equal(4);
    });

    it("Vue SearchPresenter handles custom event fired by SearchResultsView", function tw2_5_20_4() {
       installOwnCreateElement();
       let dishId;
        const renderingSearchResults = SearchPresenter({
            model: new Proxy({
               searchResultsPromiseState: { promise: "foo", data: "bar" },
                setCurrentDish(id) {dishId = id;},
            },makeModelProxyHandler("Search presenter rendered with data, testing SearchResultsView custom events"))
        });
        expect(renderingSearchResults.children.length, "Search presenter should render two children (search form and search results)").to.equal(2);
        const searchResultsViewProps = renderingSearchResults.children[1].props;

        //expect(Object.keys(searchResultsViewProps).length, "expected 2 props in total for the SearchResultsView").to.equal(2);
        const [oneHandler]= findResultsEventName();
        
        expect(searchResultsViewProps[oneHandler],  `custom event handler ${oneHandler} should be a function`).to.be.a("function");
        // test that event handlers are not prematurely called
        expect(dishId, "did not expect model method to be called, did you pass a function as custom event handler?").to.equal(undefined);
       
        searchResultsViewProps[oneHandler]({id:42});
        expect(dishId, "custom event handler "+oneHandler+" should set current dish in the model").to.equal(42);  

    });




    it("Vue SearchPresenter performs initial search", async function tw2_5_20_1() {
        installOwnCreateElement();
        let searched = false;
        const renderingEmpty = SearchPresenter(
            {  model: new Proxy(
                {
                    searchResultsPromiseState: {},
                    doSearch(){searched = true;},
                },
                makeModelProxyHandler("Search presenter initial render, no data from promise yet"))
            });
        expect(renderingEmpty.children.length, "expected search presenter to have 2 children").to.equal(2);
        expect(renderingEmpty.children[0].tag).to.equal(SearchFormView, "expected first search presenter child to be SearchFormView");
        expect(
            renderingEmpty.children[1].children.length,
            "expecting search with no results to have a single (text) child, must not have any extra spaces"
        ).to.equal(1);
        expect(
            renderingEmpty.children[1].children[0].toLowerCase(),
            "search with no results should 'no data'"
        ).to.equal("no data");
        expect(searched, "search presenter must perform a search at first render").to.be.ok;
    });
    



});
