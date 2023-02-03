import dishesConst from "/test/dishesConst.js";
import render from "./teacherRender.js";
const VueRoot=require("./"+TEST_PREFIX+"VueRoot.js").default;

const X= TEST_PREFIX;
let getMenuDetails;

try{
    getMenuDetails= require("/src/"+X+"dishSource.js").getMenuDetails;
    if(!getMenuDetails) throw "no getMenuDetails defined";
}catch(e){
    render(<div>Please write /src/dishSource.js and export getMenuDetails</div>,  document.getElementById('root'));
}
if(getMenuDetails){
    window.getMenuhDetails=getMenuDetails;
    //const AA= 523145,   BB= 787321,   CC= 452179;
    const AA= 548321,   BB= 758118,   CC=    1152690;
    //const AA= 1445969,  BB=  1529625, CC=    32104;

    const preamble= <div><p> This is the TW2.2 getMenuDetails test. It reads 3 dishes and, when they arrive, it saves them into the model</p>
                      <p>Check (and change in tw/tw2.2.0.js) the source code for other interesting dish IDs</p>
                      <p>getMenuDetails is set as global by this test, so you can experiment with it at the Console.</p>
                      <p>You can use the myModel object to examine the model at the Console.</p>
                      <hr/></div>;
    render(
        <div>{preamble}Wait...</div>,
        document.getElementById('root')
    );
    getMenuDetails([AA, BB, CC]).then(
        function testACB(dishes){
            render(
                <div>{preamble}<VueRoot/></div>,
                document.getElementById('root')
            );
            window.myModel= require("./"+TEST_PREFIX+"VueRoot.js").proxyModel;
            
            dishes.forEach(function addDishCB(dish){window.myModel.addToMenu(dish);});
            window.myModel.setNumberOfGuests(5);
        })
        .catch(function errorACB(err){
            console.error(err);
            render(<div>{err}</div>,document.getElementById('root'));
        });
}
