// Add relevant imports
import {createRouter, createWebHashHistory, RouterView} from "vue-router";
const PREFIX=window.location.toString().includes("react")?"reactjs":"vuejs";

const Summary=require("../"+PREFIX+"/summaryPresenter.js").default;
const Sidebar=require("../"+PREFIX+"/sidebarPresenter.js").default;
const Search=require("../"+PREFIX+"/searchPresenter.js").default;
const Details=require("../"+PREFIX+"/detailsPresenter.js").default;


const myModel= reactive(new DinnerModel());
const router= createRouter({
    history: createWebHashHistory(),
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

//function VueRoot(){ return <App model={proxyModel} />;}

export  {VueRoot, router}
