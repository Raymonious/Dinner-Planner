import render from "./teacherRender.js";


// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+X+"DinnerModel.js").default;
let promiseNoData;
try{
    promiseNoData=require("/src/views/"+X+"promiseNoData.js").default;
    if(!promiseNoData || !DinnerModel.prototype.doSearch) throw "not defined";
}catch(e){
    render(<div>
             Please write /src/views/promiseNoData.js
             <br/>Please write DinnerModel.doSearch()
           </div>,  document.getElementById('root'));
}
if(promiseNoData && DinnerModel.prototype.doSearch){
    const preamble=<div><p> This is the TW2.4 promiseNoData test in combination with some UI, to check the idiom promiseNoData() || SomeUI.</p>
                     <p>It resolves a dish search promise into your model, and displays the results in an ordered list</p>
                     <p>You can edit tw/tw2.4.3.js to test promiseNoData in other combinations</p>
                     <hr/></div>;
    const VueRoot={
        data(){
            return {rootModel: new DinnerModel()} ;
        } ,
        render(){
            if(!this.rootModel.searchResultsPromiseState.promise)
                this.rootModel.doSearch({});

            return <div>{preamble}{promiseNoData(this.rootModel.searchResultsPromiseState)||
                <ol>{
                        this.rootModel.searchResultsPromiseState.data.map(function eachResultCB(dishResult){
                        return <li key={dishResult.id}>{JSON.stringify(dishResult)}</li>;
                    })
                }</ol>}</div>;
        },
    };
    
    render(
        <VueRoot/>
        ,    document.getElementById('root')
    );
}

