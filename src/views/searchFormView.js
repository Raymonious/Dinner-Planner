function SearchFormView(aa){
    return(
        <div>
            <input onChange = {putTextACB}></input>
            <select onChange={chooseTypeACB}>
                <option>Choose:</option>
                {aa.dishTypeOptions.map(searchOptionsCB)}
            </select>
            <button onClick = {startSearchACB}>Search!</button>
        </div>

    );
    function startSearchACB(){
        aa.onSearch();
    }

    function chooseTypeACB(type){
        aa.onChoose(type.target.value);
    }

    function putTextACB(name){
        aa.onText(name.target.value);
    }

    function searchOptionsCB(type){
        return(<option>{type}</option>);
    }
}
export default SearchFormView;
