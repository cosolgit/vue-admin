<template>
  <el-select size="small" v-model="data.selectValue" @change="select">
    <el-option v-for="item in data.initOption" :key="item.id" :value="item.value" :label="item.label"></el-option>
  </el-select>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
export default {
  name: "selectVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    },
  },
  setup(props, { emit,root }) {
    const data = reactive({
      selectValue: "",
      initOption:[],
      option: [
        { value: "truename", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" },
      ]
    });

    /**
     *初始化下拉选项
     */
    let initOption=()=>{
      let initData=props.config.init;
      //数据校验   代码
      if(initData.length===0){
        console.log("config的参数为空,无法显示下拉菜单");
        return false;
      };
      let optionArr=[];//不用数组存起来,就会每改一次组件就重新渲染一次
      initData.forEach(item=>{
        let arr=data.option.filter(elem=>elem.value===item);
        if(arr.length>0){
          optionArr.push(arr[0]);
        }
      })
      if(optionArr.length===0){
        console.log("匹配的数据为空");
        return false;
      }
      data.initOption=optionArr;
      data.selectValue=optionArr[0].value;
      //返回初始值,不然初始为undefined,无法进行搜索
      emit("update:selectData",optionArr[0]);
    }

    const select=(val)=>{
      let filterData=data.option.filter(item=>item.value===val)[0];
      emit("update:selectData",filterData)
    }
    onMounted(()=>{
      initOption();
    })
    return {
      data,
      select
    };
  }
};
</script>

<style>
</style>