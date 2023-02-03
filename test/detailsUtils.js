import { assert, expect } from "chai";
import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";
import {dishInformation} from "./mockFetch.js";

const X = TEST_PREFIX;

function findDetailsEventName(){
    const {customEventNames}= prepareViewWithCustomEvents(
        require("../src/views/" + X + "detailsView.js").default,
        {dishData:dishInformation, isDishInMenu:true, guests:6},
        function findButton(rendering){
            const button=findTag("button", rendering).filter(function(button){ return button.props && button.props.disabled; });
            expect(button.length, "expected to find a disabled 'add to menu' button in Details view").to.equal(1);
            return button ;
        });
    return customEventNames;
}

export {findDetailsEventName};
