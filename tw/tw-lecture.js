import  React from "react";
import {render} from "react-dom";

// use this to test array rendering...
const cars= [{ id:1, doors:4, make: "Ferrari", model: "Testarossa" }, 
             { id:2, doors:2, make: "Ferrari", model: "Dino" }, // comma after last accepted
            ];



function MyComponent(props){
    return <div class="debug">
             <button>click me!</button>
             <input placeholder={props.placeholder} />
             <select>
               <option>Pick one:</option>
               <option>My way</option>
               <option>The highway</option>
             </select>
           </div>;
}

render(<MyComponent placeholder="type here please!" /> ,
       document.getElementById("root"));
