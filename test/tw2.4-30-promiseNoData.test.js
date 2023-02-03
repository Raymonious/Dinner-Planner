import { expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";

let promiseNoData;
const X = TEST_PREFIX;
try {
  promiseNoData = require("/src/views/" + X + "promiseNoData.js").default;
} catch (e) { }

describe("TW2.4 promiseNoData (async suspense) [test](/tw2.4.2.html) [combined with promise result view](/tw2.4.3.html)  ", function tw2_4_30() {
    this.timeout(200000);

    before(function tw2_4_30_before() {
        installOwnCreateElement();
        if (!promiseNoData) this.skip();
    });

    function ckeckNoData(response){
        expect(response.tag, "promiseNoData must return a DIV when tehre is no promise").to.be.equal("div");
        expect(response.children.length,"expecting DIV to have a single (text) child, must not have extra spaces").to.equal(1);
        expect(response.children[0].toLowerCase(),  "Does the text say 'no data' in the div").to.equal("no data");
        expect(response.children[0], "NO DATA message should be displayed as a string!").to.be.a("string");
    }
    it('promiseNoData returns a DIV with "no data" content when promise in the promise state is falsy', async function tw2_4_30_1() {
        ckeckNoData(promiseNoData({ }));
        ckeckNoData(promiseNoData({ pomise:undefined}));      
        ckeckNoData(promiseNoData({ promise: null }));
    });

    function checkLoadingImage(response){
        expect(response.tag, "promiseNoData must return a loading img when there is a promise but no data or error").to.be.equal("img");
        expect(response.props.src, "The image returned by promiseNoData when there is a promise but no error must have a src (source) attribute").to.be.a("string");
    }
    it("promiseNoData returns an image  when promise is not yet resolved (data and error in promise state are falsy) ", async function tw2_4_30_2() {
        checkLoadingImage(promiseNoData({ promise: "dummy" }));
        checkLoadingImage(promiseNoData({ promise: "dummy", data:null }));
        checkLoadingImage(promiseNoData({ promise: "dummy", errror:null }));
        checkLoadingImage(promiseNoData({ promise: "dummy", data:null, errror:null }));
    });

    function checkErrorDiv(response){
        expect(response.tag, "When there is an error,  promiseNoData should return a DIV containing the error message").to.equal("div");
        expect(response.children.length, "expecting error DIV to have a single (text) child, must not have any extra spaces?").to.equal(1);
        expect(response.children[0], "The error message should be rendered as a string. React will not accept other types").to.be.a("string");
        expect(response.children[0],  "promiseNoData must render the error sent").to.equal("dummy error to show");
    }
    it("promiseNoData returns a div with the error text if the error in promise state is truthy", async function tw2_4_30_3() {
        function Error(error) {
        this.error = error;
        }
        Error.prototype.toString = function errorToString() {
            return `${this.error}`;
        };
        
        const error = new Error("dummy error to show");
        
        checkErrorDiv( promiseNoData({ promise: "dummy",error: error,}));
        checkErrorDiv( promiseNoData({ promise: "dummy",error: error,data:null}));

  });

    function checkFalsy(response){
        expect(response, "promiseNoData with promise and data should return falsy").to.be.not.ok;
    }
    it("promiseNoData returns falsy when data in promise state is not undefined and promise is truthy", async function tw2_4_30_4() {
        checkFalsy(promiseNoData({ promise: "dummy", data: "some data" }));
        checkFalsy(promiseNoData({ promise: "dummy", data: "some data" , error:null}));
  });
});
