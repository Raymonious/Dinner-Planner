import render from "./teacherRender.js";


// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+X+"DinnerModel.js").default;

//const AA= 523145,   BB= 787321,   CC= 452179;
//const AA= 548321,   BB= 758118,   CC=    1152690;
const AA= 1445969,  BB=  1529625, CC=    32104;

let proxyModel;
const preamble=<div><p> This is the TW2.4 setCurrentDish test</p>
                 <p>In the beginning it should show an empty currentDishPromiseState</p>
                 <p>After 2 seconds, the current dish is set and the promise state should get populated with data</p>
                 <p>After 6 seconds, the current dish is set again, so you can see the promise state changing</p>
                 <p>You can edit tw/tw2.4.js to see other dish data in the promise state</p>
                 <hr/></div>;
const VueRoot={
    data(){
        return {rootModel: new DinnerModel()} ;
    } ,
    render(){
        return <div>{preamble}
                 current dish promise state: {JSON.stringify(this.rootModel.currentDishPromiseState)}
               </div>;
    },
    created(){
        proxyModel=this.rootModel;
    },
};

render(
    <VueRoot/>
    ,    document.getElementById('root')
);

setTimeout(function firstlyACB(){proxyModel.setCurrentDish(BB);}, 2000);

setTimeout(function laterACB(){proxyModel.setCurrentDish(AA);}, 6000);

