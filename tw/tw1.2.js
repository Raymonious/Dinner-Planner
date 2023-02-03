import render from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";

// make webpack load the file only if it exists
const SummaryView=require("/src/views/"+TEST_PREFIX+"summaryView.js").default;

const {shoppingList}=require("/src/"+TEST_PREFIX+"utilities.js");

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

render(
    <div>This page tests TW1.2 Basic Rendering in a SummaryView for 3 people. We also use this page later to test TW1.3 Array Rendering, as it passes the ingredients prop.
      <hr/>
      <SummaryView people={3} ingredients={shoppingList([getDishDetails(2), getDishDetails(100), getDishDetails(200)])}/>
    </div>,
        
    document.getElementById('root')
);


    
