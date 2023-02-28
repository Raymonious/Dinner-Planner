// This is the Vue TW3.3 bootstrapping. 
import "/src/teacherFetch.js";
import {createApp, h} from "vue";

// needed for View JSX in the lab:
window.React= {createElement:h};

// When VueRoot and the router are exported, uncomment the lines below.
// using require() instead of import, for the above assignmentxs to take effect before VueRoot is loaded

const {VueRoot, router}=require("/src/vuejs/VueRoot.js");

const app=createApp(VueRoot);
app.use(router);
app.mount('#root');

// Look up in the Vue documentation what createApp, app.use and app.mount are doing

// The #root DIV can be found in /src/index.html.
// Webpack will add the needed JavaScript before serving it as /vue/index.html
// The path vue/index.html and its association with this JS file is configured in webpack.config.js
