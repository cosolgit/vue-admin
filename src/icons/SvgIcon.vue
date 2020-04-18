<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import {reactive,ref,onMounted,computed} from '@vue/composition-api';
export default {
  name:"svgIcon",
  //简写props:['iconClass','className'],
  props:{
    iconClass:{
      type:String,
      default:"",   //复杂类型 ()=>[] ()=>({})
      /* required:true,   //必须不穿会报错
      validator:(value)=>{  //校验规则
        return value>=0
      } */
    },
    className:{
      type:String,
      default:""
    }
  },
  setup(props){
    const msg=ref("我来教你学前端1dwwdwdw1");

    const count=ref(10);
    /**
     * computed
     */
    const plusOne=computed({
      get:()=>{
        return count.value+2222
      },
      set:val=>{
        count.value=val+111111
      }
    })

    const iconName=computed(()=>`#icon-${props.iconClass}`);
    const svgClass=computed(()=>{
      if(props.className){
        return `svg-icon ${props.className}`
      }else{
        return 'svg-icon'
      }
    })
    return {
      msg,
      iconName,
      svgClass
    }
  }
};
</script>

<style lang="scss" scoped >
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>
