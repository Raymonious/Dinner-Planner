import { assert, expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement.js";
import {findTag, allChildren, searchProperty} from "./jsxUtilities.js";
import {findDetailsEventName} from "./detailsUtils.js";


import {dishInformation} from "./mockFetch.js";

let DetailsView;
const X = TEST_PREFIX;
try {
  DetailsView = require("../src/views/" + X + "detailsView.js").default;
} catch (e) { }

describe("TW2.3 Free rendering, fire custom events. Work with stacktraces: DetailsView [test Vue](/tw2.3.2.html) [React](/tw2.3.2-react.html)", function tw2_3_30() {
  this.timeout(200000);

  let rendering, jsxChildren;
  let guests = 3;
  let disabled = true;

    before(function tw2_3_30_before() {
        if (!DetailsView) this.skip();
        else {
            installOwnCreateElement();
            rendering= DetailsView({dishData:dishInformation,guests:guests,isDishInMenu:{disabled}});
            jsxChildren = allChildren(rendering);
        }
    });

    function ceilAndFloor(num) {
        return [Math.floor(num), Math.ceil(num)];
    }

    it("DetailsView renders dish price _and_ dish price for all guests", function tw2_3_30_1() {
        const price=ceilAndFloor(dishInformation.pricePerServing);
        expect(searchProperty(jsxChildren,"textContent", price),"The price of the dish is not rendered. Check the stacktrace to find what the test is searching for.").to.be.ok;

        const priceForGuests= ceilAndFloor(dishInformation.pricePerServing * guests); 
        expect(searchProperty(jsxChildren,"textContent", priceForGuests),
               "pricePerServings should be also shown multiplied by the number of guests. Check the stacktrace to examine the test!"
              ).to.be.ok;
    });
    
    it("DetailsView renders all ingredients (name, amount, measurement unit). ", function tw2_3_30_3() {
        dishInformation["extendedIngredients"].forEach(function tw2_3_30_3_checkIngredientCB(ingredient) {
            expect(searchProperty(jsxChildren, "textContent", [ingredient.name]),
                   "ingredient names must be displayed. Could not find: "+ingredient["name"]+" Check the stacktrace to find what the test is searching for"
                  ).to.be.ok;
            
            expect(searchProperty(jsxChildren, "textContent", [ingredient["unit"]]),
                   "Measurement units are not showing. Could not find: "+ingredient["unit"]+ " for ingredient "+ingredient["name"]+" Check the stacktrace to find what the test is searching for"
                  ).to.be.ok;

            expect(searchProperty(jsxChildren, "textContent", [ingredient["amount"]]),
                   "Ingredient amount not found: "+  ingredient["amount"] +" for ingredient "+ingredient["name"]+ " . Ingredient amounts do not need to be multiplied by number of guests."
                  ).to.be.ok;
            
        });
  });

  it("DetailsView renders cooking instructions", function tw2_3_30_4() {
    expect(
        searchProperty(jsxChildren, "textContent", [dishInformation.instructions.slice(0, 30),])
        , "Cooking instructions not found. Check the stacktrace to find what the test is searching for." 
    ).to.be.ok;
  });

  it("DetailsView has link to recipe", function tw2_3_30_5() {
    expect(searchProperty(jsxChildren, "href", [dishInformation["sourceUrl"]], "a", true)
           , "link to original recipe not found.  Check the stacktrace to find what the test is searching for."
          ).to.be.ok;
  });

    it("DetailsView renders dish image", function tw2_3_30_6() {
        expect(searchProperty(jsxChildren, "src", [dishInformation.image], "img", true)
               , "image of the dish was not found. Check the stacktrace to find what the test is searching for."
              ).to.be.ok;
  });

 it("DetailsView has button to add to menu, disabled if dish is in menu", function tw2_3_30_7() {
     const buttons=findTag("button", rendering);
     let addToMenuButton;
     buttons.forEach(button => {
         if (
             (button.children[0].toLowerCase().includes("add") ||
              button.children[0].toLowerCase().includes("menu"))
         ) {
             addToMenuButton = button;
         }
     });
     expect(addToMenuButton, "add to menu button not found, looking for a button with label that contains 'add' and 'mennu'").to.not.be.undefined;
     expect(addToMenuButton.props.disabled.disabled, "'Add to menu' button must be disabled if the dish is already in the menu").to.equal(disabled);
 });
    it("DetailsView 'add to menu' button fires a custom event", function tw2_3_30_9(){
        findDetailsEventName();
    });
    
  it("DetailsView does not change its props during rendering", function tw2_3_30_8() {
    installOwnCreateElement();
    const props = {dishData: dishInformation, guests: guests, isDishInMenu: disabled};
    const json = JSON.stringify(props);
    DetailsView(props);
    expect(JSON.stringify(props),"DetailsView doesn't change its props during render").to.equal(json);
  });
});
