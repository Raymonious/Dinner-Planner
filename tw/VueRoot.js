import DinnerModel from "/src/DinnerModel.js";
import App from "/src/views/app.js";
import {reactive, onMounted} from "vue";

let proxyModel;

const VueRoot={
    setup(){
        const rootModel= reactive(new DinnerModel());
        proxyModel= rootModel;
        
        return function renderACB(){
            return <App model={rootModel} />;
        };
    }
}
export default VueRoot;

export {proxyModel};
