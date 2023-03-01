import DetailsView from "../views/detailsView.js";
import promiseNoData from "../views/promiseNoData.js";
import {watchEffect,reactive} from "vue"; 
import resolvePromise from "../resolvePromise.js"
import { getDishDetails } from "../dishSource.js";

//TW3 Search, Details, ...
export default{
    name: "DetailsPresenter",   // useful for Vue stacktraces
    props:["model"],
    
    setup(aa){
        const promiseState= reactive({});
       
        function isDishInMenuHandlerACB(dish){
            return (aa.model.currentDish === dish.id);
        }

        function addToMenuHandlerACB(){
            aa.model.addToMenu(promiseState.data);
        }

        function hasChangedACB(){
            console.log("current dish changes to: ", aa.model.currentDish);
            // good place to resolve current dish promise in component state
            // you can also cancel the effect / promise,  not needed in the lab: 
            if (aa.model.currentDish)
            resolvePromise(getDishDetails(aa.model.currentDish), promiseState); 
            
        }
        watchEffect(hasChangedACB);

        return function renderACB(){return promiseNoData(promiseState)||
            <DetailsView dishData={promiseState.data} 
            isDishInMenu = {aa.model.dishes.filter(isDishInMenuHandlerACB).length === 1}
            guests = {aa.model.numberOfGuests}
            addToMenu = {addToMenuHandlerACB}
        />;};
    },
};




