// Add relevant imports
import {createRouter, createWebHashHistory, RouterView} from "vue-router";
import DinnerModel from "../DinnerModel.js";
import { reactive} from "vue";
import Details from "./detailsPresenter.js"; 
import Search from "./searchPresenter.js"; 
import Sidebar from "./sidebarPresenter.js"; 
import Summary from "./summaryPresenter.js"; 
import promiseNoData from "../views/promiseNoData.js";
import resolvePromise from "../resolvePromise.js";
import { onMounted, onUnmounted } from "vue";
import { firebaseModelPromise } from "../firebaseModel.js";



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
        const firebasePromiseState = reactive({});

        function bornACB(){
            resolvePromise(firebaseModelPromise(myModel), firebasePromiseState)
        }
        function beGoneACB(){
               console.log("bye");
        }
        onMounted(bornACB);
        onUnmounted(beGoneACB);
        
        return function renderAppACB(){
            return(
                promiseNoData(firebasePromiseState)||
                  <div class = "flexParent">
                  <div><Sidebar class = "sidebar" model={myModel}/></div>
                  <div><RouterView class = "mainContent"/></div>
                  </div>
                  );
        };
    },
};



export  {VueRoot, router}
