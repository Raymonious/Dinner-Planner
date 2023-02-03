import render from "./teacherRender.js";

// make webpack load the file only if it exists
const X= TEST_PREFIX;

let promiseNoData;
try{
    promiseNoData=require("/src/views/"+X+"promiseNoData.js").default;
}catch(e){
    render(<div>
             Please write /src/views/promiseNoData.js
           </div>,  document.getElementById('root'));
}
if(promiseNoData){
    const preamble= <div><p> This is the TW2.4 promiseNoData test. It tests for a promise state of a succesful promise, and for the promise state of a rejected promise</p>
                      <p>You can edit tw/tw2.4.2.js to test promiseNoData in other combinations</p>
                      <hr/></div>;
    const VueRoot={
        data(){
            return { successPromiseStatus: {}, errorPromiseStatus:{}};
        } ,
        render(){
            return <div>{preamble}{
                promiseNoData(this.successPromiseStatus)|| <div>Simulated promise resolved successfully. Result: {this.successPromiseStatus.data}</div>
            }
                     <br/>
                     {
                         promiseNoData(this.errorPromiseStatus)|| <div>will never be seen</div>
            }</div>;
        },
        created(){
            const thisObj=this;
            setTimeout(function initializePromiseStatusACB(){
                thisObj.successPromiseStatus.promise="dummyPromise";
                thisObj.errorPromiseStatus.promise="dummyPromise";
            }, 1000);
            setTimeout(function setDataACB(){
                thisObj.successPromiseStatus.data="dummy promise result";
            }, 2000);
            setTimeout(function setErrorCB(){
                thisObj.errorPromiseStatus.error="dummy simualted error";
            }, 3000);
            
        }
    };
    
    render(
        <VueRoot/>
        ,    document.getElementById('root')
    );
}

