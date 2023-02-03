import render from "./teacherRender.js";


// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+X+"DinnerModel.js").default;
const searchDishes=require("/src/"+X+"dishSource.js").searchDishes;
try{
    if(!DinnerModel.prototype.doSearch) throw "not defined";
}catch(e){
    render(<div>
             Please write DinnerModel.doSearch()
           </div>,  document.getElementById('root'));
}

if(DinnerModel.prototype.doSearch){
    const preamble= <div><p> This is the TW2.4 doSearch test. It performs a search with empty parameters and display the model searchResultsPromiseState</p>
                      <p>You can edit tw/tw2.4.1.js to add search parameters</p>
                      <hr/></div>;
    const VueRoot={
        data(){
            return {rootModel: new DinnerModel()} ;
        } ,
        render(){
            if(!this.rootModel.searchResultsPromiseState.promise){
                this.rootModel.doSearch({});
            }
                

            return <div>{preamble}
                   search results promise state: {JSON.stringify(this.rootModel.searchResultsPromiseState)}
               </div>;
        },
    };
    
    render(
        <VueRoot/>
        ,    document.getElementById('root')
    );
}

