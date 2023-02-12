function DetailsView(aa){
    return(
        <div>
            <h1>aa.dishData.title </h1>
            <div>
            <table border = {5} width = {'400'}><tbody><tr>
                <td><img src = {aa.dishData.image} height = {'100'} width = {'100'}></img></td>
                <tr><td>Price: </td><td>{aa.dishData.pricePerServing}</td></tr>
                <tr><td>for {aa.guests} guests: </td><td>{aa.guests * aa.dishData.pricePerServing}</td></tr>
            </tr></tbody></table></div>

            <div>
                <table border = {5} width = {'400'}><tbody>
                    <tr> <h2>Ingredients: </h2></tr>
                    <tr class = "bold"> <td>Name</td><td>Amount</td><td>Unit</td></tr>
                    {aa.dishData.extendedIngredients.map(getIngredientCB)}
                </tbody></table></div>
           
            <div>
                <table border = {5} class = "block" width = {'400'}><tbody>
                    <tr> <h2>Instruction: </h2></tr>
                    <tr>{aa.dishData.instructions}</tr>
                    <tr><a href = {aa.dishData.sourceUrl}>More information</a></tr>
                </tbody></table></div>
            
            <div>
                <button disabled = {aa.isDishInMenu} onClick = {menuAddACB}>Add to menu!</button>
                <button>Cancel</button>
            </div>
        </div>
    );
    function menuAddACB(){
        aa.addToMenu(true);
    }

    function getIngredientCB(ingre){
        return(
        <tr key={ingre.name}>
            <td>{ingre.name} </td><td>{ingre.amount}</td><td>{ingre.unit}</td>
        </tr>);
    }
}
export default DetailsView;
