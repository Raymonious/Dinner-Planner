import { dishType, menuPrice, sortDishes } from "../utilities";
function SidebarView(aa){
    return(
        <div>
            <button disabled = {aa.number <= 1} onClick = {minusACB}>-</button>
            {aa.number}
            <button onClick = {plusACB}>+</button> 
            <table>
                <tbody>{
                    sortDishes(aa.dishes).map(dishTableRowCB)}
                </tbody>
                <tr>
                    <td></td>
                    <td class  = "right">Total:</td>
                    <td></td>
                    <td class = "right"> {(menuPrice(aa.dishes) * aa.number).toFixed(2)}</td>
                </tr>
            </table>
            
        </div>
    );
    function plusACB(){
        aa.onNumberChange(aa.number + 1);
        
    }
    function minusACB(){
        aa.onNumberChange(aa.number - 1);
    }
    function dishTableRowCB(dish){
        return <tr key={dish.id }>
                <td><button onClick={xClickACB} title="Remove">x</button></td>
                <td><a onClick={nameClickACB} href = "#" title="More Info">{dish.title}</a></td>
                <td>{dishType(dish)}</td>
                <td class = "right"> {(aa.number * dish.pricePerServing).toFixed(2)}</td>
            </tr>;
        function nameClickACB(){
        aa.checkDish(dish);
        }
        function xClickACB(){
            aa.removeDish(dish);
        }
    } 
}
export default SidebarView;