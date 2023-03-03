function DetailsView(aa){
    return(
        <div>
            <div class = "box1 title und">{aa.dishData.title} </div>
            <div class = "box ">
            <table  width = {'400'}><tbody><tr>
                <td><img src = {aa.dishData.image} height = {'100'} ></img></td>
                <tr><td>Price: </td><td>{aa.dishData.pricePerServing}</td></tr>
                <tr><td>for {aa.guests} guests: </td><td>{aa.guests * aa.dishData.pricePerServing}</td></tr>
            </tr></tbody></table></div>

            <div class = "box">
                <table width = {'400'}><tbody>
                    <tr class = "title"> Ingredients: </tr>
                    <tr class = "bold"> <td>Name</td><td>Amount</td><td>Unit</td></tr>
                    {aa.dishData.extendedIngredients.map(getIngredientCB)}
                </tbody></table></div>
           
            <div class = "box">
                <table width = {'400'}><tbody>
                    <tr class = "title"> Instruction: </tr>
                    <tr>{aa.dishData.instructions}</tr>
                    <tr><a href = {aa.dishData.sourceUrl}>More information</a></tr>
                </tbody></table></div>
            
            <div>
                <button class = "button" disabled = {aa.isDishInMenu} onClick = {menuAddACB}>Add to menu!</button>
                <button class = "button" onClick={dishCancleACB}>Cancel</button>
            </div>
        </div>
    );
    
    function dishCancleACB(){
        window.location.hash="#/search"
    }

    function menuAddACB(){
        aa.addToMenu();
        window.location.hash="#/search"
    }

    function getIngredientCB(ingre){
        return(
        <tr key={ingre.name}>
            <td>{ingre.name} </td><td>{ingre.amount}</td><td>{ingre.unit}</td>
        </tr>);
    }
}
export default DetailsView;