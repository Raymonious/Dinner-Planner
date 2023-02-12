export default function resolvePromise(promiseToResolve, promiseState){
    if(!promiseToResolve) return;
    promiseState.promise = promiseToResolve;
    promiseState.data= null;         
    promiseState.error= null;

    function storeDataACB(data){ 
        if(promiseState.promise !== promiseToResolve) return;
        promiseState.data = data;
    } 
    function recordErrorACB(error)  { 
        if(promiseState.promise !== promiseToResolve) return;    
        promiseState.error = error;
    }
    promiseToResolve.then(storeDataACB).catch(recordErrorACB);
}