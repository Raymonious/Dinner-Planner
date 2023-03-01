import { dishType, menuPrice, sortDishes} from "../utilities";

function SidebarView(pikachu){
    return (
        <div>
         <button disabled = {pikachu.number > 1 ? false : true} onClick = {minusNumACB} >-</button>
         {pikachu.number}   
         <button onClick = {plusNumACB}>+</button>   

         <table>
                <thead>
                </thead>
                <tbody>
                  {sortDishes(pikachu.dishes).map(dishesTableRowCB)}
                  <tr>
                    <td> </td>
                    <td class = "bold right">Total:</td>
                    <td> </td>
                    <td>{(menuPrice(pikachu.dishes) * pikachu.number).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
        </div>
   );
   function minusNumACB(eve){
    pikachu.onNumberChange(pikachu.number - 1);
   }
   function plusNumACB(eve){
    pikachu.onNumberChange(pikachu.number + 1);
   }

   function dishesTableRowCB(dish){
    return <tr key={dish.id}>
            <td><button onClick = {xPressedACB}>x</button></td>
             <td class="center"><a href = "#/details" onClick = {linkDishACB}>{dish.title}</a></td>
             <td class="center">{dishType(dish)}</td>
             <td class="right">{(dish.pricePerServing * pikachu.number).toFixed(2)}</td>
           </tr>;

    function linkDishACB(eve){
      pikachu.dishInquired(dish);
      
    }

    function xPressedACB(eve){
      pikachu.dishRemoved(dish);
    }
}
  
}




export default SidebarView;
