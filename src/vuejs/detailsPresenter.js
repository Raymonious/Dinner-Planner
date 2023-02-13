import DetailsView from "../views/detailsView.js";
import promiseNoDate from "../views/promiseNoData.js";
export default
function Detail(aa){
    return <div> {promiseNoDate(aa.model.currentDishPromiseState) ||
        <DetailsView dishData={aa.model.currentDishPromiseState.data} 
        isDishInMenu = {aa.model.dishes.filter(isDishInMenuHandlerACB).length === 1}
        guests = {aa.model.numberOfGuests}
        addToMenu = {addToMenuHandlerACB}
    />}</div>;

    function isDishInMenuHandlerACB(dish){
        return (aa.model.currentDish === dish.id);
    }

    function addToMenuHandlerACB(){
        aa.model.addToMenu(aa.model.currentDishPromiseState.data);
    }
}
