function SearchResultsView(aa){
    return(
        <div class = "flexP2 ">
            {aa.searchResults.map(resultSearchCB)}
            
        </div>
    );
    function resultSearchCB(dish){
        return(
        <span class = "search" onClick={clickFoodACB}>
            <img src={dish.image} height={'100'}></img>
            <div class= "seartext">{dish.title}</div>   
        </span>
        );
        function clickFoodACB(){
            aa.clickToSearch(dish);
            window.location.hash="#/details"
        }
    }
}
export default SearchResultsView;