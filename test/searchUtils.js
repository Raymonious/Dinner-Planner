import { assert, expect } from "chai";
import {withMyFetch, mySearchFetch, findCGIParam, searchResults} from "./mockFetch.js";
import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";

const X = TEST_PREFIX;

function findFormEventNames(){
    const {customEventNames, customEventParams}= prepareViewWithCustomEvents(
        require("../src/views/" + X + "searchFormView.js").default,
        {dishTypeOptions:['starter', 'main course', 'dessert']},
        function collectControls(rendering){
            const buttons=findTag("button", rendering).filter(function(button){ return button.children.flat()[0].toLowerCase().trim().startsWith("search"); });
            const selects=findTag("select", rendering);
            const inputs=findTag("input", rendering);
            expect(buttons.length, "SearchFormview expected to have one search button").to.equal(1);
            expect(inputs.length, "SearchFormView expected to have one  input box").to.equal(1);
            expect(selects.length, "SearchFormView expected to have one  select box").to.equal(1);
            return [...inputs, ...selects, ...buttons];
        },
        ["some test query", "some test type"]
    );

    const [onInput, onSelect, onButton]=customEventNames;
    const [inputParam, selectParam]= customEventParams;
    
    expect(inputParam.length, "expected custom event "+onInput+" to be fired with one parameter").to.equal(1);
    expect(inputParam[0], "expected custom event "+onInput+" to get as parameter the value typed in the input box").to.equal("some test query");
    
    expect(selectParam.length, "expected custom event "+onSelect+" to be fired with one parameter").to.equal(1);
    expect(selectParam[0], "expected custom event "+ onSelect+" to get as parameter the value chosen in the dropdown").to.deep.equal("some test type");
    return customEventNames;
}

//var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
//nativeInputValueSetter.call(input, 'react 16 value');

function findResultsEventName(){
    const {customEventNames, customEventParams}= prepareViewWithCustomEvents(
        require("../src/views/" + X + "searchResultsView.js").default,
        {searchResults:[searchResults[0]]},
        function findSpans(rendering){
            const spans= findTag("span", rendering).filter(function checkSpanCB(span){ return span.props && span.props.onClick; });
            expect(spans.length, "SearchResultsView with one result should contain at least a span with click handler").to.gte(1);
            return spans;
        });
    const[onDishClick]= customEventNames;
    const[dishChosen]= customEventParams;
    expect(dishChosen.length, "expected custom event "+onDishClick+" to be fired with one parameter").to.equal(1);
    expect(dishChosen[0], "expected custom event "+onDishClick+" to get a search result as parameter").to.equal(searchResults[0]);

    return customEventNames;
}


const dummyImgName = "promise loading image GIF";

function makeRender(formProps, resultsProps, h, render, theReact, makeRoot){
    function DummyForm(props){
        formProps.push(props);
        return <span>dummy form</span>;
    }
    function DummyResults(props){
        resultsProps.push(props);
        return <span>dummy results</span>;
    }

    function DummyImg(props){
        resultsProps.push(dummyImgName);
        return "dummyIMG";
    }
    
    function DummyNoData(props){
        resultsProps.push("no promise, no data");
        return "no data";
    }    
    function replaceViews(tag, props, ...children){
        if(tag==require("../src/views/" + X + "searchFormView.js").default)
            return h(DummyForm, props);
        if(tag==require("../src/views/" + X + "searchResultsView.js").default)
            return h(DummyResults, props);
        if(tag=="img") // FIXME this assumes that the presenter renders no other image than the spinner
            return h(DummyImg, props);
        if(tag=="div" && children && children[0] && (""+children[0]).toLowerCase()=="no data")
            return h(DummyNoData, props);
        return h(tag, props, ...children);
    };
    return async function doRender(){
        const div= document.createElement("div");
        window.React= theReact;
        window.React.createElement= replaceViews;
        formProps.length=0;
        resultsProps.length=0;


        await withMyFetch(
            mySearchFetch,
            function theRender(){
                render(makeRoot(), div);
                // should be "no data", under the form
                //console.error(div.firstElementChild.firstElementChild.nextSibling);
            },
            function makeResults(url){
                return {results:searchResults};
            }  
        );


        expect(div.firstElementChild, "nothing was rendered, do you miss a return statement?").to.be.ok;
        return div;
    };
}

export {findResultsEventName, findFormEventNames, makeRender, dummyImgName};
