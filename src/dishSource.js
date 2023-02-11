import {BASE_URL, API_KEY} from "/src/apiConfig.js";

function getMenuDetails(array){
    return fetch(BASE_URL + "recipes/informationBulk?ids=" + array.join(), 
    {method: 'GET', headers:{'X-Mashape-Key': API_KEY}}).then(responseHandlerACB);
}

function responseHandlerACB(response){
    if(!response.ok) throw new Error("API problem "+response.status);
    return response.json();
}

function processDataACB(data){
    return data;
}

function arrayCommaACB(array){
    if(!array.ok) throw new Error("API problem "+array.status);
    return array.join();
}


    
export{getMenuDetails};