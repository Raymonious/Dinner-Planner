
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
  <div class = "bor">
         <button v-bind:disabled = "isButtonDiabled" class = "button" @click = "minusNumACB" >-</button>{{props.number}}<button class = "button" @click = "plusNumACB">+</button>   
         </div>
         <table>
                <th>
                </th>
                <tbody>
                <tr v-for = "opt in sortDishes(props.dishes)"> 
                <td ><button class = "button" @click = "xPressedACB(opt)">x</button></td>
                  <td><a href = "#details" @click = "linkDishACB(opt)">{{opt.title}}</a></td>
                  <td>{{dishType(opt)}}</td>
                  <td>{{(opt.pricePerServing * props.number).toFixed(2)}}</td>
                </tr>
              </tbody>
          </table>
          <div class="box1 ab">
          <table width=100%><tbody>
          <tr>
                    <td colspan="3">Total:</td>
                    <td class="right">{{(menuPrice(props.dishes) * props.number).toFixed(2)}}</td> 
                  </tr>
                </tbody>
              </table>
          </div>

        </div>

</template>