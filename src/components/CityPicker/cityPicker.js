import {GetCityPicker} from "@/api/common";
import {reactive, toRefs} from "@vue/composition-api";
export function cityPicker() {
  const regionData=reactive({
    provinceValue:"",
    cityValue:"",
    areaValue:"",
    streetValue:"",
    provinceData:[],
    cityData:[],
    areaData:[],
    streetData:[]
  })

  const resultData=reactive({
    provinceValue:"",
    cityValue:"",
    areaValue:"",
    streetValue:"",
  })

  const getProvince = () => {
    getData({type: "province"});
  }
  const handlerProvince=(val)=>{
    resetValue({type:"city"});
    getData({type: "city",province_code:val});
  }
  const handlerCity=(val)=>{
    resetValue({type:"area"});
    getData({type:"area",city_code:val})
  }
  const handlerArea=(val)=>{
    resetValue({type:"street"});
    getData({type:"street",area_code:val});
  }
  const handlerStreet=(val)=>{
    resetValue({type:""})
  }

  const getData=(params)=>{
    GetCityPicker(params).then(response=>{
      regionData[`${params.type}Data`]=response.data.data.data;
    })
  }

  //重置选项
  const resetValue=(params)=>{
    /**
     * 比if(type=="street"){regionDat.streetValue=""}这种更好
     */
    const valueJson={
      city:["cityValue","areaValue","streetValue"],
      area:["areaValue","streetValue"],
      street:["streetValue"],
    }
    //清空指定key值
    if(params.type)valueJson[params.type].forEach(item=>regionData[item]="");

    result();
  }

  //返回数据集合
  const result=()=>{
    for(let key in resultData){
      resultData[key]=regionData[key];
    }
  }
  return {
    regionData,
    resultData,
    getProvince,
    handlerProvince,handlerCity,handlerArea,handlerStreet
  }
}