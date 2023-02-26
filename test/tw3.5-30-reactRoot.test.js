import {testReact, testSuspense} from "./rootUtils";

describe("TW3.3 React root initial suspense [test](/react/index.html)", function tw3_5_30() {
    this.timeout(200000);

    it("ReactRoot reads model data from persistence, with suspense", async function tw3_5_30_1(){
        if(!await testReact(testSuspense))
            this.skip();
    });
});

