const { initializeApp }= require( "firebase/app");
const { getDatabase, ref, get, set, onValue}= require( "/src/teacherFirebase.js");

// Add relevant imports here 
// TODO

// Initialise firebase app, database, ref
// TODO

function observerRecap(/*TODO*/) {
    //TODO
}

function modelToPersistence(/* TODO */){
    // TODO return an object
}

function persistenceToModel(/* TODO */){
    // TODO return a promise
}

function firebaseModelPromise(model) {
    // TODO return a promise chain that
    // 1) retrieves data from firebase using firebase get()
    // 2) saves the data into the model (received as parameter)
    // 3) adds a model observer that calls firebase set() and modelToPersistence()
    // 4) optional: calls firebase onValue() for live update
}


// Remember to uncomment the following line:
// export {observerRecap, modelToPersistence, persistenceToModel, firebaseModelPromise};
