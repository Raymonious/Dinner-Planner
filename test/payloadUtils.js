import {withMyFetch, myDetailsFetch, dishInformation} from "./mockFetch.js";
import { assert, expect } from "chai";


let initialized=false;
const payloads=[];
async function readPayloads(){
    initialized=true;
    try{
        let payloadIndex=0;
        
        const DinnerModel= require('../src/'+TEST_PREFIX+'DinnerModel.js').default;
        const model= new DinnerModel();
        model.addObserver(payload=> payloads[payloadIndex++]=payload);
        model.setNumberOfGuests(7);
        model.addToMenu({id:42});
        const oldFetch= fetch;
        window.fetch= myDetailsFetch;
        try{
            model.setCurrentDish(42);
            await model.currentDishPromiseState.promise;
        }
        finally{ window.fetch=oldFetch; }
        /* for some reason this code breaks Hot Module Replacement
        await withMyFetch(  
            myDetailsFetch,
            async function interact(){
                model.setCurrentDish(42);
                await model.currentDishPromiseState.promise
            },
            function makeResults(url){
                return {id:42};
            }            
        );
*/

        model.removeFromMenu({id:42});
        //console.log("finished reading payloads ", payloads);
    }catch(e){
        console.error(e);
    }
}
if(!initialized)
    setTimeout(readPayloads, 0);

async function changeGuests(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.numberOfGuests=42;
    observers.forEach(o=>o(payloads[0]));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when numberOfguests changes");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when numberOfguests changes");
}

async function addDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.dishes=[...modelTarget.dishes, {...dishInformation, id:42}];
    observers.forEach(o=>o(payloads[1]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when adding a dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when adding a dish");
}
async function removeDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.dishes=modelTarget.dishes.slice(0, -1);
    observers.forEach(o=>o(payloads[payloads.length-1]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when removing a dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when removing a dish");
}

async function noCurrentDishPromise(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.currentDishPromiseState={};
    observers.forEach(o=>o(payloads[3]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when changing current dish promise");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when changing current dish promise");
}
async function changeCurrentDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.dishes.currentDish=42;
    observers.forEach(o=>o(payloads[2]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when setting current dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when setting current dish");

    modelTarget.currentDishPromiseState={promise:"dummy"};
    observers.forEach(o=>o(payloads[3]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when setting current dish promise");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when setting current dish promise");

    modelTarget.currentDish=42;
    modelTarget.currentDishPromiseState.data={...dishInformation, id:42};
    observers.forEach(o=>o(payloads[4]));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update current dish promise resolves");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when current dish promise resolves");
}

async function dummyNotification(modelTarget, observers, propsHistory){
    propsHistory.length=0;
    observers.forEach(o=>o({dummy:"payload"}));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length)
        expect.fail("must not update on notification with dummy payload");

}
export {changeGuests, addDish, removeDish, changeCurrentDish, noCurrentDishPromise, dummyNotification}
