import render from "./teacherRender.js";

// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+TEST_PREFIX+"DinnerModel.js").default;

let Search;
try{
    Search=require("/src/reactjs/"+X+"searchPresenter.js").default;
}catch(e){
    render(<div>
             Please write /src/reactjs/searchPresenter.js
           </div>,  document.getElementById('root'));
}
if(Search){
    const model= new DinnerModel();
    const preamble=<div><p> This is the TW3.2 React Search presenter test.</p>
                     <p>It displays the Search interface, and you should be able to perform searches</p>
                     <p>You should also see some initial search results (use component lifecycle).</p>
                     <hr/></div>;        
    window.myModel=model;
    render(
        <div>
          {preamble}
          <Search model={model}/>
        </div>,
        document.getElementById('root')
    );       
}
