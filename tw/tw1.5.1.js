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

let Sidebar;
const X= TEST_PREFIX;
try{
    Sidebar=require("/src/vuejs/"+X+"sidebarPresenter.js").default;
}catch(e){
    render(<div>Please define /src/vuejs/sidebarPresenter.js</div>,  document.getElementById('root'));
}
if(Sidebar) {   

    render(<div>TW1.5 Passing props from Presenters to Views. This is a non-interactive test of the Sidebar presenter. It should show the sidebar view based on a model with 5 guests and 4 dishes.
             <hr/>
             <Sidebar model={model}/>
           </div>
           ,
        document.getElementById('root')
    );
}    
