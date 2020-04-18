<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="regionData.provinceValue" @change="handlerProvince">
          <el-option v-for="item in regionData.provinceData" :key="item.id" :value="item.PROVINCE_CODE" :label="item.PROVINCE_NAME"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="regionData.cityValue" @change="handlerCity">
          <el-option v-for="item in regionData.cityData" :key="item.id" :value="item.CITY_CODE" :label="item.CITY_NAME"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="regionData.areaValue" @change="handlerArea">
          <el-option v-for="item in regionData.areaData" :key="item.id" :value="item.AREA_CODE" :label="item.AREA_NAME"></el-option>
        </el-select>
      </el-col> 
      <el-col :span="6" v-if="init.street">
        <el-select v-model="regionData.streetValue" @change="handlerStreet" >
          <el-option v-for="item in regionData.streetData" :key="item.id" :value="item.STREET_CODE" :label="item.STREET_NAME"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {reactive,watch,onBeforeMount} from "@vue/composition-api";
import {cityPicker} from "./cityPicker";
export default {
  name:"cityPicker",
  props:{
    cityPickerLevel:{
      type:Array,
      default:()=>[]
    },
    cityPickerData:{
      type:Object,
      default:()=>{}
    }
  },
  setup(props,{emit}){
    const {getProvince,regionData,resultData,handlerProvince,handlerCity,handlerArea,handlerStreet}=cityPicker();

    //初始化
    const init=reactive({
      province:false,
      city:false,
      area:false,
      street:false
    })
    const initCityPicker=()=>{
      let initData=props.cityPickerLevel;
      if(initData.length==0){
        for(let key in init){
          init[key]=true;
        }
      }else{
        initData.forEach(item=>{
          init[item]=true;
        })
      }
    }
    
    watch([
      ()=>resultData.provinceValue,
      ()=>resultData.cityValue,
      ()=>resultData.areaValue,
      ()=>resultData.streetValue,
    ],([province,city,area,street])=>{
      emit("update:cityPickerData",resultData)
    })

    onBeforeMount(()=>{
      //获取省份
      getProvince();
      initCityPicker();
    })



    return {
      init,regionData,
      handlerProvince,handlerCity,handlerArea,handlerStreet
    }
  }
};
</script>

<style lang="scss" scoped>
</style>