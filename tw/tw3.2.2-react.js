import render from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";
function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}


// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+TEST_PREFIX+"DinnerModel.js").default;

let Sidebar;
try{
    Sidebar=require("/src/reactjs/"+TEST_PREFIX+"sidebarPresenter.js").default;
}catch(e){}

let Summary;
try{
    Summary=require("/src/reactjs/"+TEST_PREFIX+"summaryPresenter.js").default;
}catch(e){}

const preamble=<div>
                 <p>This is the TW3.2 React Component State, Lifecycle and Observer interactive test, featuring Sidebar and Summary presenters</p>
                 <p>Once a component (Sidebar, Summary) is available and exported, it will be displayed.</p>
                 <p>The two presennters observe the same Application State (model) so interacting in Sidebar will change the Model, and the changes will be visible in both Sidebar and Summary</p>
                 <p>You can use myModel at the Console to examine the Model, add observers. Calling model methods like setNumberOfGuests should be reflected in the interface.</p>
               </div>;
const model= new DinnerModel();
window.myModel=model;
window.myModel.addToMenu(getDishDetails(200));
window.myModel.addToMenu(getDishDetails(2));
window.myModel.addToMenu(getDishDetails(100));
window.myModel.addToMenu(getDishDetails(1));
window.myModel.setNumberOfGuests(5);

render(
    <div>
      {preamble}
      {Sidebar &&< Sidebar model={model}/>}
      <hr/>
      {Summary &&< Summary model={model}/>}
    </div>
    , document.getElementById('root')
);       

