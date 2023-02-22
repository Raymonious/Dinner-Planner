import DinnerModel from "/src/DinnerModel.js";
import App from "/src/views/app.js";

import {reactive} from "vue";

const proxyModel= reactive(new DinnerModel()); // can use reactive outside any function!

export default function VueRoot(){ return <App model={proxyModel} />;}

export {proxyModel};  // to make the model accessible for testing
