<template>
  <el-select size="small" v-model="selectValue">
    <el-option v-for="item in initOptionData" :key="item.id" :value="item.value" :label="item.label"></el-option>
  </el-select>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
export default {
  name: "userIndex",
  data(){
    return {
      selectValue: "",
      initOptionData:[],
      option: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" },
      ]
    }
  },
  methods:{
    initOption(){
      let initData=this.config.init;
      //数据校验   代码
      if(initData.length===0){
        console.log("config的参数为空,无法显示下拉菜单");
        return false;
      };
      let optionArr=[];//不用数组存起来,就会每改一次组件就重新渲染一次
      initData.forEach(item=>{
        let arr=this.option.filter(elem=>elem.value===item);
        if(arr.length>0){
          optionArr.push(arr[0]);
        }
      })
      if(optionArr.length===0){
        console.log("匹配的数据为空");
        return false;
      }
      this.initOptionData=optionArr;
      this.selectValue=optionArr[0].value;
    }
  },

  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  watch:{
    config:{
      handler(newVal,oldVal){
        this.initOption();
      },
      //组件初始化马上监听,beforeCreate,created之间执行
      immediate:true
    }
  }
};
</script>

<style>
</style>