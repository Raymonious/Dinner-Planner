import { assert, expect } from "chai";
import createUI from "./createUI.js";
import installOwnCreateElement from "./jsxCreateElement.js";
import {findFormEventNames}from "./searchUtils.js";

let SearchFormView;
const X = TEST_PREFIX;
try {
  SearchFormView = require("../src/views/" + X + "searchFormView.js").default;
} catch (e) { }

const { render, h } = require("vue");

describe("TW2.3 rendering recap, fire custom events: SearchFormView [test Vue](/tw2.3.html) [React](/tw2.3-react.html)", function tw2_3_10() {
  this.timeout(200000); // increase to allow debugging during the test run

  before(function tw2_3_10_before() {
    if (!SearchFormView) this.skip();
  });

  it("SearchFormView renders required DOM tree with dishTypeOptions prop", function tw2_3_10_1() {
    let div = createUI();
    window.React = { createElement: h };
    render(
      <SearchFormView
        dishTypeOptions={["starter", "main course", "dessert"]}
      />,
      div
    );
    expect(
      div.querySelectorAll("input").length,
      "1 textbox expected"
    ).to.equal(1);
    expect(
      div.querySelectorAll("select", "Must only have 1 select").length
    ).to.equal(1);
    expect(
      div.querySelectorAll("input")[0].nextSibling.firstChild.textContent,
      "Choose: is rendered"
    ).to.equal("Choose:");
    expect(
      div.querySelectorAll("option", "4 options must be rendered").length
    ).to.equal(4);
    expect(
        div.querySelectorAll("option")[0].firstChild.textContent?.trim(),
      "The first option must be Choose: "
    ).to.equal("Choose:");
    expect(
      div.querySelectorAll("option")[0].firstChild.textContent,
      "The first option is 'Choose:' but it has spaces before or after. Do you have spaces between the tag and {..} ? "
    ).to.equal("Choose:");
    expect(
        div.querySelectorAll("option")[1].firstChild.textContent?.trim(),
      "The second option is 'starter'"
    ).to.equal("starter");
      expect(
          div.querySelectorAll("option")[1].firstChild.textContent,
          "The second option is 'starter'  but it has spaces before or after. Do you have spaces between the tag and {..} ?"
      ).to.equal("starter");
    expect(
      div.querySelectorAll("option")[2].firstChild.textContent,
      "The third option 'main course'"
    ).to.equal("main course");
      expect(
          div.querySelectorAll("option")[3].firstChild.textContent,
          "The third last option 'dessert'"
         ).to.equal(
      "dessert"
    );
    expect(div.querySelectorAll("button").length, "there should be at least one button").to.be.gte(1);
      expect(div.querySelectorAll("button")[0].firstChild.textContent, "the first button text must be \"Search!\"").to.equal("Search!");
  });

  it("SearchFormView performs array rendering rather than repeating UI", function tw2_3_10_2() {
    function checkArrayRendering(div, dishTypes) {
    render(
      <SearchFormView
        dishTypeOptions={dishTypes}
      />,
      div
    );
    const options = div.querySelectorAll("option");
    expect(options.length, `Are there ${dishTypes.length + 1} options rendered?`).to.equal(dishTypes.length + 1);
    expect(options[0].firstChild.textContent, "First option must be 'Choose:'").to.equal("Choose:");
    }

    let div = createUI();
    window.React = { createElement: h };
    const dishTypes = ["starter", "main course", "dessert"];
    checkArrayRendering(div, dishTypes);

    let div2 = createUI();
    window.React = { createElement: h };
    const dishTypes2 = ["primero", "segundo", "tercero", "cuarto"];
    checkArrayRendering(div2, dishTypes2);
});

    it("SearchFormView fires custom events on text or type change (send text, type as parameter), and on button press", function tw2_3_10_4() {
        findFormEventNames();
    });

it("SearchFormView does not change its props during rendering", function tw2_3_10_3() {
  installOwnCreateElement();
  const props = {dishTypeOptions:["starter", "main course", "dessert"]};
  const json = JSON.stringify(props);
  const rendering= SearchFormView(props);
  expect(JSON.stringify(props),"SearchFormView doesn't change its props during render").to.equal(json);
});

});
