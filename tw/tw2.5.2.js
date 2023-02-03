import render from "./teacherRender.js";


// make webpack load the file only if it exists
const X= TEST_PREFIX;

const DinnerModel=require("/src/"+X+"DinnerModel.js").default;

let Search;
try{
    Search=require("/src/vuejs/"+X+"searchPresenter.js").default;
}catch(e){
    render(<div>
             Please write /src/vuejs/searchPresenter.js
           </div>,  document.getElementById('root'));
}
if(Search){
const preamble=<div><p> This is the TW2.5 Search presenter test</p>
                 <p>It displays the Search interface, and you should be able to perform searches</p>
                 <p>When you are done with the presenter, you should also see some initial search results.</p>
                 <p>You can access and manipulate the model from the Console using myModel. Changing the model should be visible in the user interface.</p>
                 <hr/></div>;        
    const VueRoot={
        data(){
        return {rootModel: new DinnerModel()} ;
        } ,
        render(){
            return <div>{preamble}<Search model={this.rootModel} /></div>;
        },
        created(){
        window.myModel= this.rootModel;
        },
    };
    
    render(
        <VueRoot/>
        ,    document.getElementById('root')
    );
}
