export default function promiseNoData(promState){
    if (!promState.promise)
        return <div>No data</div>;
    if (promState.promise && !promState.data && !promState.error)
        return <img src="https://media.tenor.com/9PHuBQSONZcAAAAC/jojos-bizarre-adventures-rero-rero.gif" class="rerorero"/>;
    if (promState.promise && !promState.data && promState.error)
        return <div>{promState.error.toString()}</div>;
    if (promState.promise && promState.data && !promState.error)
        return false;
}