function SearchResultsView(aa){
    return(
        <div>
            {aa.searchResults.map(resultSearchCB)}
            
        </div>
    );
    function resultSearchCB(dish){
        return(
        <span class= "search" onClick={clickFoodACB}>
            <img src={dish.image} height={'100'}></img>
            <div>{dish.title}</div>   
        </span>
        );
        function clickFoodACB(){
            aa.clickToSearch(dish);
        }
    }
}
export default SearchResultsView;