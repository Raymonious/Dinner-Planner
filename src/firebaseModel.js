const { initializeApp }= require( "firebase/app");
const { getDatabase, ref, get, set, onValue}= require( "/src/teacherFirebase.js");

import DinnerModel from "./DinnerModel";
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
const rf= ref(db, PATH+"/demo");




function observerRecap(model){
    function obsACB(payload) {
        console.log(payload);
    }
    model.addObserver(obsACB);
}


function modelToPersistence(model){
    // TODO return an object
    let curDish = model.currentDish;
    if(!model.currentDish) curDish = null;
    return {numberOfGuests: model.numberOfGuests, dishes: model.dishes.map(getIDCB).sort(), currentDish: curDish};
    function getIDCB(dish){
        return dish.id;
    }

}

function persistenceToModel(persistedData, model){
    // TODO return a promise
    if(!persistedData){
        model.setNumberOfGuests(2);
        model.dishes = []
    }
    else{
        model.setNumberOfGuests(persistedData.numberOfGuests);
        model.setCurrentDish(persistedData.currentDish);
        getMenuDetails(persistedData.dishes).then(updateDishACB);

        function updateDishACB(dishes){
            model.dishes = dishes;
        }

    }
    return model;
    
}




function firebaseModelPromise(model) {
    // TODO return a promise chain that
    // 1) retrieves data from firebase using firebase get()
    return get(rf).then(dataHandlerACB).then(wakeObserverACB);
    // 2) saves the data into the model (received as parameter)
    function dataHandlerACB(dataFromFirebase){
        return persistenceToModel(dataFromFirebase.val(), model);
    }
    // 3) adds a model observer that calls firebase set() and modelToPersistence()
    //add observer after the model has been processed by persistenceToModel
    function wakeObserverACB(model){
        model.addObserver(obsACB); 
        return model;
    }

    function obsACB() {
        //TODO
        set(rf,modelToPersistence(model));
    }
    


    // 4) optional: calls firebase onValue() for live update
}


// Remember to uncomment the following line:
export {observerRecap, modelToPersistence, persistenceToModel, firebaseModelPromise};
