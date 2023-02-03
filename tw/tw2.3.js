import render from "./teacherRender.js";


// make webpack load the file only if it exists
const X= TEST_PREFIX;
let SearchFormView;

try{
    SearchFormView=require("/src/views/"+X+"searchFormView.js").default;
}catch(e){
    render(<div>Please define /src/views/searchFormView.js</div>,  document.getElementById('root'));
}
if(SearchFormView){
     const preamble= <div><p> This is the TW2.3 search form view test</p>
                    <p>You can edit tw/tw2.3.js to write the names you chose for the 3 custom events, so you can test custom event firing</p>
                    <hr/></div>;
    render(<div>{preamble}
        <SearchFormView dishTypeOptions={["starter", "main course", "dessert"]}
                        FIXMEcustomEvent1={function searchTextACB(text){ console.log("user wants to set the dish search text ", text); }}
                        FIXMEcustomEvent2={function searchTypeCB(type){ console.log("user wants to set the dish search type ", type); }}
                        FIXMEcustomEvent3={function searchNowACB(){ console.log("user wants to search now!"); }}
        /></div>,
        document.getElementById('root')
    );
}
