import render from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";

// make webpack load the file only if it exists
const X= TEST_PREFIX;
let SidebarView;

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

try{
    SidebarView=require("/src/views/"+X+"sidebarView.js").default;
}catch(e){
    render(<div>Please define /src/views/sidebarView.js</div>,  document.getElementById('root'));
}
if(SidebarView){
    render(
        <div>
          This page tests TW1.3 Array Rendering in a SidebarView for 5 people, with 3 dishes.
          <hr/>
          <SidebarView number={5} dishes={[getDishDetails(2), getDishDetails(100), getDishDetails(200)]}  />
        </div>,
        document.getElementById('root')
    );
}

    
