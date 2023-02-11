/* 
   This component uses Vue-specific and React-specific presenters: Sidebar, Summary, Search, Details, Show 
   Therefore it needs to import from alternative paths, depending on the framework. 
   To achieve that, we use require() with a prefix, instead of import.
*/
const PREFIX=window.location.toString().includes("react")?"reactjs":"vuejs";

const Summary=require("../"+PREFIX+"/summaryPresenter.js").default;
const Sidebar=require("../"+PREFIX+"/sidebarPresenter.js").default;

export default
function App(props){
    return (<div>
                <div class="flexParent">
                <div><Sidebar class="sidebar" model={props.model} /></div>
                <div><Summary class="mainContent" model={props.model} /></div>
                </div>
            </div>
           );
}