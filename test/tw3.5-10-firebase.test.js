import { assert, expect } from "chai";

import {withMyFetch, myDetailsFetch, dishInformation} from "./mockFetch.js";

const {findPersistencePropNames, state, initDB}= require("./mockFirebase.js");

let firebaseModel;

const X = TEST_PREFIX;
try {
  firebaseModel = require("../src/" + X + "firebaseModel.js");
} catch (e) {console.log(e);}

describe("TW3.5 Firebase-model", function tw3_5_10() {
    this.timeout(200000); // increase to allow debugging during the test run
    
    before(function tw3_5_10_before() {
        if (!firebaseModel) this.skip(); // should not happen, firebaseModel.js is defined by default
        if (!Object.keys(firebaseModel).length) this.skip();
    });

    it("modelToPersistence", function tw3_5_10_1(){
        initDB();
    });
    
    it("persistenceToModel", async function tw3_5_10_1(){
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        const model=  {
            setNumberOfGuests(g){ this.numberOfGuests= g;},
            setCurrentDish(d){ this.currentDish=d; }
        };
        const model2={...model};

        const result= await withMyFetch(myDetailsFetch, function(){
            return firebaseModel.persistenceToModel( {
                [numberOfGuests]:32,
                [dishes]:[49, 42],
                [currentDish]:22
            },model
                              );
        });
        expect(model.currentDish, "the current dish set in the model should be the same as in the cloud").to.equal(22);
        expect(model.numberOfGuests, "the number of guests set in the model should be the same as in the cloud").to.equal(32);
        expect(model.dishes.map(d=>d.id).sort(), "the dishes set in the model should be retrieved from the API based on the IDs from the cloud").to.eql([42, 49]);
        expect(myDetailsFetch.lastFetch, "persistenceToModel should call the API, passing the given dish IDs").to.include("49");
        expect(myDetailsFetch.lastFetch, "persistenceToModel should call the API, passing the given dish IDs").to.include("42");
        expect(result, "persistenceToModel should return a promise that resolves to a truthy object (hint: just return the model)").to.be.ok;

        const result2= await withMyFetch(myDetailsFetch, function(){
            return firebaseModel.persistenceToModel(undefined,model2);
        });
        expect(model2.currentDish, "if there is no data in the cloud, currentDish should be set to null or not defined").to.not.be.ok;
        expect(model2.numberOfGuests, "if there is no data in the cloud, number of guests should be set to 2").to.equal(2);
        expect(model2.dishes.map(d=>d.id),  "if there is no data in the cloud, the model dishes should be set to an empty array").to.eql([]);
    });

       it("observer added by observerRecap should print its parameter (aka payload), examine that on the console!", function tw3_5_10_21() {
            let observerAdded;
            firebaseModel.observerRecap({ addObserver(o){  observerAdded=o; }});
            expect(observerAdded, "observerRecap must add an observer").to.be.ok;
            expect(observerAdded, "observerRecap must be a function").to.be.a("function");

            const oldConsole= console;
            let wasLogged;
            const someObject= {test:"value"};
            window.console= { log(x){ wasLogged=x; } } ;
            try{
                observerAdded(someObject); 
            }finally{  window.console=oldConsole; }
           expect(wasLogged,"observerRecap must console.log the payload").to.equal(someObject);
           const DinnerModel= require('../src/'+TEST_PREFIX+'DinnerModel.js').default;
           const model= new DinnerModel();
           
           firebaseModel.observerRecap(model);
           model.notifyObservers("payload example 1");
           model.notifyObservers("payload example 2");
       });

    it("firebaseModelPromise copies get() result into the model, after getMenuDetails resolves", async function tw3_5_10_3(){
        state.getHistory=[];
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        
        state.data={
            [numberOfGuests]:13,
            [dishes]:[ 45, 42, 22],
            [currentDish]: 42
        };
        const model= { setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;}, addObserver(){}};
        await withMyFetch(myDetailsFetch, async function(){
            await firebaseModel.firebaseModelPromise(model);
        });
        expect(state.getHistory.length, "the firebase promise makes a get() call").to.equal(1);
        state.data[dishes].forEach(x=>expect(myDetailsFetch.lastFetch, "firebase promise chain initiates getMenuDetails promise").to.include(x));
        expect(model.numberOfGuests, "data from firebase get() is set into the model (nr. guests)").to.equal(state.data[numberOfGuests]);
        expect(model.currentDish, "data from firebase get() is set into the model (current dish)").to.equal(state.data[currentDish]);
        expect(model.dishes.map(d=>d.id), "dihes with the IDs from firebase get() are retrieved via getMenuDetails and set into the model").to.eql(state.data[dishes]);
    });

    it("firebaseModelPromise adds a model observer, which invokes set()", async function tw3_5_10_3(){
        let obs;
        state.getHistory=[];
        await withMyFetch(myDetailsFetch, async function(){
            await firebaseModel.firebaseModelPromise({ setNumberOfGuests(){}, setCurrentDish(){}, addObserver(o){obs=o;}});
        });
        expect(obs, "the last stage of the firebase model promise chain adds an observer to the model").to.be.ok;
        expect(obs, "the observer is expected to be a function").to.be.a("function");
        state.setHistory=[];        
        obs();
        expect(state.setHistory.length, "the observer performs a set() operation").to.equal(1);
        expect(state.setHistory[0].val, "data set by the observer is the data from the model (modelToPersistence)" ).to.eql(state.data);
        expect(state.getHistory[0].ref, "the firebase get() and set() are performed on the same REF").to.eql(state.setHistory[0].ref);        
    });

    it("firebaseModelPromise resolves to a truthy value (e.g. the model)", async function tw3_5_10_3(){
        let result;
        await withMyFetch(myDetailsFetch, async function(){
            result= await firebaseModel.firebaseModelPromise({ setNumberOfGuests(){}, setCurrentDish(){}, addObserver(){}});
        });
        expect(result, "the last ACB in the firebase promise chain returns truthy (e.g. the model)").to.be.ok;
    });
    it("live update (optional): firebaseModelPromise invokes onValue() to copy cloud data into the model", async function tw3_5_10_3(){
        state.onHistory=[];
        state.getHistory=[];
        let notified;
        let payload;
        let obs;
        const model={setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;}, addObserver(o){obs=o;}, notifyObservers(p){ notified=true; payload=p; }};
        await withMyFetch(myDetailsFetch, async function(){
            await firebaseModel.firebaseModelPromise(model);
        });
        if(!state.onHistory.length)
            this.skip();
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        const acb= state.onHistory[0].acb;
        expect(acb, "a callback is passed to onValue()").to.be.a("function");
        expect(state.getHistory[0].ref, "get() and onState() are performed on the same REF").to.eql(state.onHistory[0].ref);
        const data= {
                [numberOfGuests]:15,
                [dishes]:[ 45, 42, 21],
                [currentDish]: 42
        };
        await withMyFetch(myDetailsFetch, function(){
            acb({
                val(){ return data; }
            });
        });

        data[dishes].forEach(x=>expect(myDetailsFetch.lastFetch, "firebase promise chain initiates getMenuDetails promise").to.include(x));
   
        expect(model.numberOfGuests, "data from firebase onValue() is set into the model (nr. guests)").to.equal(data[numberOfGuests]);
        expect(model.currentDish, "data from firebase onValue() is set into the model (current dish)").to.equal(data[currentDish]);
        expect(model.dishes.map(d=>d.id), "dihes with the IDs from firebase onValue() are retrieved via getMenuDetails and set into the model").to.eql(data[dishes]);

        expect(notified, "after copying data in the model, the onValue ACB notifies observers").to.be.ok;
        expect(payload, "the onValue ACB notifies observers with a payload").to.be.ok;
        state.setHistory=[];
        obs(payload);
        expect(state.setHistory.length, "when the observer sees the onValue ACB payload, it refrains from invoking set(), to avoid saving to firebase the data that was just read from firebase").to.equal(0);
    });
});





