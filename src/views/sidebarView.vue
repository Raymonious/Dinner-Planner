
<script setup>
import { dishType, menuPrice, sortDishes} from "../utilities";
const props = defineProps(["dishes", "number", "dishInquired", "dishRemoved"]);
const emit = defineEmits(["NumberChange"]);

const isButtonDiabled = (props.number > 1)? false : true;
function minusNumACB(eve){
    emit("NumberChange",(props.number - 1));
}
function plusNumACB(eve){
    emit("NumberChange",(props.number + 1));
}

function linkDishACB(opt){
      props.dishInquired(opt);
}

function xPressedACB(opt){
      props.dishRemoved(opt);

}


</script>
<template>
<div>
         <button v-bind:disabled = "isButtonDiabled" @click = "minusNumACB" >-</button>{{props.number}}<button @click = "plusNumACB">+</button>   
         <table>
                <th>
                </th>
                <tbody>
                <tr v-for = "opt in sortDishes(props.dishes)"> 
                <td ><button @click = "xPressedACB(opt)">x</button></td>
                  <td><a href = "#" @click = "linkDishACB(opt)">{{opt.title}}</a></td>
                  <td>{{dishType(opt)}}</td>
                  <td>{{(opt.pricePerServing * props.number).toFixed(2)}}</td>
                </tr>
                  <tr>
                    <td> </td>
                    <td>Total:</td>
                    <td> </td>
                    <td>{{(menuPrice(props.dishes) * props.number).toFixed(2)}}</td> 
                  </tr>
                </tbody>
              </table>
        </div>

</template>