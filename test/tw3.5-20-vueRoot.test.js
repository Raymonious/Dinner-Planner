import {testVue, testSuspense} from "./rootUtils";

describe("TW3.3 Vue root initial data [test](/vue/index.html)", function tw3_5_20() {
    this.timeout(200000);

    it("VueRoot reads model data from persistence, with suspense", async function tw3_5_20_1(){
        if(!await testVue(testSuspense)) this.skip();;
    });
});
