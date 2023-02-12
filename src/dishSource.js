import {BASE_URL, API_KEY} from "/src/apiConfig.js";

function getMenuDetails(array){
    return fetch(BASE_URL + "recipes/informationBulk?ids=" + array.join(), 
    {method: 'GET', headers:{'X-Mashape-Key': API_KEY}}).then(responseHandlerACB);
}

function responseHandlerACB(response){
    if(!response.ok) throw new Error("API problem "+response.status);
    return response.json();
}

function getDishDetails(id){
    return getMenuDetails([id]).then(resultProcessACB);
}   

function resultProcessACB(data){
    return data[0];
}
function searchDishes(object){
    return fetch(BASE_URL + "recipes/complexSearch?" + 
    new URLSearchParams({query:object.query, type:object.type}), 
    {method: 'GET', headers:{'X-Mashape-Key': API_KEY}}).then(responseHandlerACB).then(dataHandlerACB);
}

function searchConditions(object){

    if(object.query && object.type){
        return new URLSearchParams({query:object.query, type:object.type});
    }
    else if (!object.query && object.type){
        return new URLSearchParams({type:object.type});
    }
    else if (object.query && !object.type)
    return new URLSearchParams({type:object.type});



}


function dataHandlerACB(data){
    return data.results;
}

export{getMenuDetails, searchDishes, getDishDetails};