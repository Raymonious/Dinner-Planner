import SearchFormView from "../views/searchFormView";
import promiseNoData from "../views/promiseNoData";
import SearchResultsView from "../views/searchResultsView";
import { searchDishes } from "../dishSource";
import resolvePromise from "../resolvePromise";

export default function Search(pikachu){
    if(!pikachu.model.searchResultsPromiseState.promise) {
        pikachu.model.doSearch({});
    }
    
    return <div><SearchFormView onChoose = {searchTypeModifierACB} onText = {searchTextModifierACB} 
    onSearch = {searchStateModifierACB} dishTypeOptions = {["starter", "main course", "dessert"]}/>{ promiseNoData(pikachu.model.searchResultsPromiseState) || 
        <SearchResultsView clickToSearch = {currentDishStateModifierACB} searchResults={pikachu.model.searchResultsPromiseState.data}/>}
        </div>;

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

}

