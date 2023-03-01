import DetailsView from "../views/detailsView.js";
import promiseNoDate from "../views/promiseNoData.js";
import {watchEffect, reactive, render} from "vue";
import resolvePromise from "../resolvePromise";

export default{ 
    name: "Detail",
    props: ["model"],
    setup(aa){
        const promiseState= reactive({});

       
        
        function isDishInMenuHandlerACB(dish){
            return (aa.model.currentDish === dish.id);
        }

        function addToMenuHandlerACB(){
            aa.model.addToMenu(aa.model.currentDishPromiseState.data);
        }

        function hasChangedACB(){
            console.log("current dish changes to: ", aa.model.currentDish);
            // good place to resolve current dish promise in component state
            // you can also cancel the effect / promise,  not needed in the lab: 
            resolvePromise(getDishDetails(aa.model.currentDish), promiseState); 
            
        }
        watchEffect(hasChangedACB);

        return function renderACB(){return promiseNoDate(promiseState)||
            <DetailsView dishData={promiseState.data} 
            isDishInMenu = {aa.model.dishes.filter(isDishInMenuHandlerACB).length === 1}
            guests = {aa.model.numberOfGuests}
            addToMenu = {addToMenuHandlerACB}
        />;};

        

    

        
    },

};


