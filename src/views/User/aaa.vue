<template>
  <div>
    子组件
    {{attrs}}
    <B v-bind="$attrs" v-on="$listeners"/>
    <el-button @click="bucc">子点这里</el-button>
  </div>
</template>

<script>
import B from "./bbb";
export default {
  components:{B},
  props:{
    
  },
  setup(props, {emit, attrs ,listeners}) {
    console.log("子组件",attrs,listeners);
    const bucc=()=>{
      //listeners.upaa();
      emit("upaa");
    }
    return {
      attrs,bucc
    };
  }
};
</script>

<style>
</style>