const { initializeApp }= require( "firebase/app");
const { getDatabase, ref, get, set, onValue}= require( "/src/teacherFirebase.js");

import { getMenuDetails } from "./dishSource";
import resolvePromise from "./resolvePromise";
// this is needed so that unit tests can inject a mock firebase
import firebaseConfig from "/src/firebaseConfig.js";
// other imports are already provided for you! 




// Add relevant imports here 
// TODO

// Initialise firebase app, database, ref
// TODO
const app= initializeApp(firebaseConfig)
const db= getDatabase(app)

//root firebase path of group 06
const PATH="dinnerModel06";
const rf= ref(db, PATH+"/test");
set(rf, "dummy"); 

function observerRecap(/*TODO*/) {
    //TODO
}

function modelToPersistence(model){
    // TODO return an object
    return model.dishes.map(getIDCB).sort();
    function getIDCB(dish){
        return dish.id;
    }

}

function persistenceToModel(persistedData, model){
    // TODO return a promise
    model.setNumberOfGuests(persistedData.numberOfGuests);
    if(!persistedData[currentDish])
    model.setCurrentDish(persistedData[currentDish]);

    return getMenuDetails(persistedData.dishes).then(modelChangerACB);
    function modelChangerACB(dishes){
        model.dishes = dishes;
        return model;
    }


}




function firebaseModelPromise(model) {
    // TODO return a promise chain that
    // 1) retrieves data from firebase using firebase get()
    // 2) saves the data into the model (received as parameter)
    // 3) adds a model observer that calls firebase set() and modelToPersistence()
    // 4) optional: calls firebase onValue() for live update
}


// Remember to uncomment the following line:
export {observerRecap, /*modelToPersistence, persistenceToModel, firebaseModelPromise*/};
