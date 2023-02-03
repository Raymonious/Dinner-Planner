import render from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";
import DinnerModel from "/src/DinnerModel.js";

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}
const model= new DinnerModel();

model.addToMenu(getDishDetails(200));
model.addToMenu(getDishDetails(2));
model.addToMenu(getDishDetails(100));
model.addToMenu(getDishDetails(1));
model.setNumberOfGuests(5);

let Summary;
const X= TEST_PREFIX;
try{
    Summary=require("/src/vuejs/"+X+"summaryPresenter.js").default;
}catch(e){
    render(<div>Please define /src/vuejs/summaryPresenter.js</div>,  document.getElementById('root'));
}
if(Summary) {   

    render(<div>TW1.5 Passing props from Presenters to Views. This is a test of the Summary presenter. It should show the summary view based on a model with 5 guests and 4 dishes.
             <p>The shopping list needed for the summary view must be computed in the presenter and passed to the View as the shoppingList prop.</p>
             <hr/>
             <Summary model={model}/>
           </div>
           ,
        document.getElementById('root')
    );
}    
