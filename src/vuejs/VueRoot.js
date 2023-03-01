// Add relevant imports
import {createRouter, createWebHashHistory, RouterView} from "vue-router";
import DinnerModel from "../DinnerModel.js";
import { reactive} from "vue";
import Details from "./detailsPresenter.js"; 
import Search from "./searchPresenter.js"; 
import Sidebar from "./sidebarPresenter.js"; 
import Summary from "./summaryPresenter.js"; 
import firebaseModel from "../firebaseModel.js";



const myModel= reactive(new DinnerModel()); //initialize a component state outside component
const router= createRouter({
    history: createWebHashHistory(), //create web history for navigation
    routes:[
        {
            path: "/",
            component: <Search model={myModel}/>,
        },

        {
            path: "/search",
            component: <Search model={myModel}/>,
        },

        {
            path: "/summary",
            component: <Summary model={myModel}/>,
        },

        {
            path: "/details",
            component: <Details model={myModel}/>,
        },
    ],
});

/*Create Root component replacing previously used app.js using Composition API*/
const VueRoot = {
    props: ["myModel"],
    setup(){
        return function renderAppACB(){
            return(<div>
                  <div class = "flexParent">
                  <div><Sidebar class = "sidebar" model={myModel}/></div>
                  <div><RouterView class = "mainContent"/></div>
                  </div>
                  </div>);
        };
    },
};



export  {VueRoot, router}
