/* Detects whether we are in a testing environment. If so, it returns a mock firebase, for testing. Otherwise it returns the real firebase. */
try{
    mocha
    module.exports= require("/test/mockFirebase.js");
}catch(e){
    // we are not testing, return the real firebase:
    module.exports= require("firebase/database");
}


