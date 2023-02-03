import dishesConst from "/test/dishesConst.js";
import render from "./teacherRender.js";

const VueRoot=require("./"+TEST_PREFIX+"VueRoot.js").default;

render(<div>
         This is the final TW1 test, it displays the full App. Do not forget to add the Sidebar presenter in src/views/app.js, for it to be visible here.
         <p> To make this fully interactive, you need to <b>handle custom events</b> in the Sidebar Presenter:
           <ul>
             <li><code>onNumberChange</code> should invoke the Model method that changes the number of guets</li>
             <li>the two dish-related custom events fired by SidebarView: one should set the current dish on the Model, the other should remove a dish from the Model</li>
           </ul>
         </p>
         <hr/>
         <VueRoot/>
         <hr/>
         Interact with your app! When the Model is changed by the custom event handlers, this test uses Vue "component state" to update the app (see <code>tw/VueRoot.js</code>). You will practice component state in TW3.
         <p>The Model is exported into the <code>myModel</code> global, so you can change the Model from the Console and see the changes in the UI. Test this at the Console: <code>myModel.setNumberOfGuests(2)
</code></p>
       </div>,
    document.getElementById('root')
);

window.location.hash="#summary";
window.myModel= require("./"+TEST_PREFIX+"VueRoot.js").proxyModel;
function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}


window.myModel.addToMenu(getDishDetails(200));
window.myModel.addToMenu(getDishDetails(2));
window.myModel.addToMenu(getDishDetails(100));
window.myModel.addToMenu(getDishDetails(1));
window.myModel.setNumberOfGuests(5);
