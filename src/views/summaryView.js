// un-comment when needed:
import {sortIngredients} from "../utilities.js";
/* Functional JSX component. Name must start with capital letter */
function SummaryView(props){
    return (
            <div className="debug">
              Summary for <span title="nr guests">{props.people}</span> persons:
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Aisle</th>
                    <th>Quantity</th>
                    <th>unit</th>
                  </tr>
                </thead>   
                            
                <tbody>
                  {  //  <---- in JSX/HTML, with this curly brace, we go back to JavaScript expressions
                      // TODO: un-comment and pass the CB below for array rendering!
                      
                      sortIngredients(props.ingredients).map(ingredientTableRowCB)

                      // TODO once the table rendering works, sort ingredients before mapping. Import the needed function from utilities.js  
                  }
                </tbody> 
                
              </table>
            </div>
    );
    /* for TW1.5 
      Note also that the callback can be defined after it is used! 
      This JS feature is called "function hoisting".
    */
    function ingredientTableRowCB(ingr){
        return <tr key={ingr.id} >
                 <td class="center">{ingr.name}</td>
                 <td class="center">{ingr.aisle}</td>
                 <td class="right">{/* multiply by number of people! Display with 2 decimals, use a CSS classs to align right */
                  (ingr.amount * props.people).toFixed(2)
                 }</td>
                 <td>{ingr.unit}</td>
               </tr>;
    }
}

export default SummaryView;
