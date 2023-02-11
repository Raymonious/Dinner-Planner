import SidebarView from "../views/sidebarView.js";

export default
function Side(aa){
    function changeACB(num){
        aa.model.setNumberOfGuests(num);
    }
    function checkACB(dish){
        aa.model.setCurrentDish(dish.id);
    }
    function removeACB(dish){
        aa.model.removeFromMenu(dish);
    }
    return <SidebarView number={aa.model.numberOfGuests} 
                        dishes={aa.model.dishes}
                        onNumberChange={changeACB}
                        checkDish={checkACB}
                        removeDish={removeACB}
                        />;
}
