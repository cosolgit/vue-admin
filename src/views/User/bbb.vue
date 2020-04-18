<template>
  <div>
    孙组件
    {{attrs}}
    
    <el-button @click="buc">点击这里</el-button>
  </div>
</template>

<script>
export default {
  setup(props, {emit, attrs ,listeners}) {
     console.log("孙组件",attrs,listeners);

    const buc=()=>{
        emit("upaa");
    }
    return {
      attrs,buc
    };
  }
};
</script>

<style>
</style>