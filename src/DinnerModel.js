import { getDishDetails, searchDishes } from "./dishSource";
import resolvePromise from "./resolvePromise";

/* This is an example of a JavaScript class.
   The Model keeps only abstract data and has no notions of graphics or interaction
*/
class DinnerModel{
    constructor(nrGuests=2, dishArray=[]){
        // other model properties will be initialized here in the coming steps
        this.numberOfGuests= nrGuests;
        this.dishes= dishArray;
        this.searchParams = {};
        this.searchResultsPromiseState = {};
        this.currentDishPromiseState = {};
        this.observers = [];
        
    }

    addObserver(callback){
        this.observers = [...this.observers, callback];
    }

    removeObserver(callback){
        function observerCB(element){
            return element !== callback;
        }
        this.observers = this.observers.filter(observerCB);
    }

    notifyObservers(payload){
        function invokeObserverCB(ACB){ 
            try{ACB(payload);}catch(err){console.error(err);}
        }
        this.observers.forEach(invokeObserverCB);
    }
    

    setNumberOfGuests(nr){
        // if() and throw exercise
        // TODO throw an Error /* new Error(someMessage) */ if the argument is smaller than 1 or not an integer
        if(nr === this.numberOfGuests) return;
        if(nr < 1 || !Number.isInteger(nr))
            throw new Error("number of guests not a positive integer");

        // The error message must be exactly "number of guests not a positive integer"
        // To learn how to check for integer, test at the Developer Tools Console: Number.isInteger(3.14)
        if(!Number.isInteger(nr) || nr < 1)
            throw new Error("number of guests not a positive integer");
        // TODO if the argument is a valid number of guests, store it in this.numberOfGuests
        else 
            this.numberOfGuests = nr;
        // When this is done, the Unit test "TW1.1 DinnerModel/can set the number of guests" should pass
        // also "number of guests is a positive integer"

        this.notifyObservers();
    }
    addToMenu(dishToAdd){
        // array spread syntax example. Make sure you understand the code below.
        // It sets this.dishes to a new array [   ] where we spread (...) the previous value
        function isDishInMenuCB(dish){
            return dishToAdd.id === dish.id;
        }
        if (this.dishes.find(isDishInMenuCB)) return;
        this.dishes= [...this.dishes, dishToAdd];
        this.notifyObservers();
    }
    
    removeFromMenu(dishToRemove){
        // callback exercise! Also return keyword exercise

        function isDishInMenuCB(dish){
            return dishToRemove.id === dish.id;
        }
        if (!this.dishes.find(isDishInMenuCB)) return;
        
        function hasSameIdCB(dish){
            return dish.id !== dishToRemove.id
            // TODO return true if the id property of dish is _different_ from the dishToRemove's id property
            // This will keep the dish when we filter below.
            // That is, we will not keep the dish that has the same id as dishToRemove (if any)
        }
        this.dishes= this.dishes.filter(hasSameIdCB);
        // the test "can remove dishes" should pass
        this.notifyObservers();
    }
    /* 
       ID of dish currently checked by the user.
       A strict MVC/MVP Model would not keep such data, 
       but we take a more relaxed, "Application state" approach. 
       So we store also abstract data that will influence the application status.
     */
    setCurrentDish(id){
        if(!id || this.currentDish === id ) return;
        this.currentDish = id;
        resolvePromise(getDishDetails(this.currentDish), this.currentDishPromiseState);
        this.notifyObservers();
    }

    setSearchQuery(searchTxt){
        if(!this.searchParams["query"]) this.searchParams = {query:searchTxt, ...this.searchParams};
        else this.searchParams["query"] = searchTxt;
    }

    setSearchType(searchType){
        if(!this.searchParams["type"]) this.searchParams = {type:searchType, ...this.searchParams};
        else this.searchParams["type"] = searchType;
    }

    doSearch(searchParams){
        resolvePromise(searchDishes(searchParams), this.searchResultsPromiseState);
    }

}

export default DinnerModel;
