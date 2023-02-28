import SidebarView from "../views/sidebarView.vue";

export default
function Sidebar(bazinga){
    return <SidebarView number={bazinga.model.numberOfGuests} dishes={bazinga.model.dishes}
    onNumberChange = {onNumHandlerACB} dishInquired = {dishInquiryHandlerACB} dishRemoved = {dishRemovalHandlerACB} />;

    function onNumHandlerACB(num){
        bazinga.model.setNumberOfGuests(num);
    }

    function dishInquiryHandlerACB(dish){
        bazinga.model.setCurrentDish(dish.id);
    }

    function dishRemovalHandlerACB(dish){
        bazinga.model.removeFromMenu(dish);
    }
}
