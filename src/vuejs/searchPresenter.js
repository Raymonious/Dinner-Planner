import SearchFormView from "../views/searchFormView";
import promiseNoData from "../views/promiseNoData";
import SearchResultsView from "../views/searchResultsView";
import { searchDishes } from "../dishSource";
import resolvePromise from "../resolvePromise";
import {onMounted, onUnmounted, reactive} from "vue";
export default{
    name: "Search",
    props: ["model"],
    
    setup(pikachu){
        function currentDishStateModifierACB(dish){
            pikachu.model.setCurrentDish(dish.id);
        }
        
        function searchStateModifierACB(){
            pikachu.model.doSearch(pikachu.model.searchParams);
        }
        
        function searchTypeModifierACB(type){
            pikachu.model.setSearchType(type);
        }
        
        function searchTextModifierACB(txt){
            pikachu.model.setSearchQuery(txt);
        }
        

        function bornACB(){
         if(!pikachu.model.searchResultsPromiseState.data)//if state already has a promise resolved, keep alive?
                pikachu.model.doSearch({});
            
        }
        function beGoneACB(){
            console.log("bye");
        }
        onMounted(bornACB);
        onUnmounted(beGoneACB);

        return function renderACB(props) { return <div><SearchFormView onChoose = {searchTypeModifierACB} onText = {searchTextModifierACB} 
        onSearch = {searchStateModifierACB} dishTypeOptions = {["starter", "main course", "dessert"]}/>{ promiseNoData(props.model.searchResultsPromiseState) || 
            <SearchResultsView clickToSearch = {currentDishStateModifierACB} searchResults={props.model.searchResultsPromiseState.data}/>}
            </div>;};
    },



};

