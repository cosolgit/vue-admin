<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" @selection-change="thatSelectCheckbox">
      <!--多选框-->
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>

      <!--有插槽和无插槽的列-->
      <template v-for="item in data.tableConfig.tHead">
        <!--v-slot插槽-->
        <el-table-column :key="item.field" v-if="item.columnType==='slot'" :prop="item.field" :label="item.label">
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!--文本数据渲染-->
        <el-table-column v-else :width="item.width" :key="item.field" :prop="item.field" :label="item.label" ></el-table-column>
      </template>
    </el-table>
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
            class="pull-right"
            v-if="data.tableConfig.paginationShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            :layout="data.tableConfig.paginationLayout"
            :total="pageData.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted ,onBeforeMount} from "@vue/composition-api";
import {loadData} from "./tableLoadData";
import {paginationHook} from "./paginationHook";
export default {
  name: "tableVue",
  props:{
    config:{
      type:Object,
      default:()=>{}
    },
    tableRow:{
      type:Object,
      default:()=>{}
    }
  },
  setup(props, { root ,emit}) {
    const {tableData,tableLoadData}=loadData();
    const {pageData,handleCurrentChange,handleSizeChange,totalCount}=paginationHook();
    const data = reactive({
      tableConfig:{
        selection:false,
        requestData:{},
        recordCheckbox:false,
        tHead:[],
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      },
      tableData: [],
    });
    /**
     * watch
     */
    //watch(()=>tableData.item,(newVal,oldVal)=>data.tableData=newVal)
    //监听多个对象
    watch([
      ()=>tableData.item,
      ()=>tableData.total
      ],([tableData,total])=>{
        data.tableData=tableData;
        totalCount(total)
    });
    watch([
      ()=>pageData.currentPage,
      ()=>pageData.pageSize
      ],([currentPage,pageSize])=>{
        let requestData=data.tableConfig.requestData;
        if(requestData.data){
          requestData.data.pageNumber=currentPage;
          requestData.data.pageSize=pageSize;
          tableLoadData(data.tableConfig.requestData)
        }
    });
    const initTableConfig=()=>{
      let configData=props.config;
      for(let key in configData){
        if(key in data.tableConfig){
          data.tableConfig[key]=props.config[key]
        }
      }
      //console.log(data.tableConfig)
    }

    const thatSelectCheckbox=(val)=>{
      let rowData={
        idItem:val.map(item=>item.id)
      }
      emit("update:tableRow",rowData);
    }

    const refreshData=()=>{
      tableLoadData(data.tableConfig.requestData);
    }
    //带参数刷新
    const paramsLoadData=(params)=>{
      let requestData=Object.assign(params,{
        pageNumber: 1,
        pageSize: 10
      })
      data.tableConfig.requestData.data=requestData;
      tableLoadData(data.tableConfig.requestData);
    }

    onMounted(()=>{
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    })

    return {
      data,pageData,
      handleCurrentChange,handleSizeChange,thatSelectCheckbox,refreshData,paramsLoadData
    };
  }
};
</script>

<style lang="scss" scoped>
.table-footer{
  padding: 15px 0;
}
</style>
<!--
v-slot 插槽:父组件传内容到子组件显示
1.匿名插槽,没有指定某一个,全部显示
2.具名插槽,指定插槽名称显示内容
3.作用域插槽,可以进行数据绑定,父子组件通讯
-->

<!-- vue3.0业务逻辑的拆分及组合,还有复用性
三个js文件就是加载数据,翻页记录,分页,
将这三个业务逻辑拆出去,独立管理,
因为没有生命周期所以,由watch监听
-->


<!-- mixin 混入(可以理解为合二为一,就是将东西拆到外面去写,)    命名冲突很容易各种覆盖

1.混入的data转给你,键名相同,则读取组件中的键名,反之读取混入键名
2.钩子:同名钩子函数将混合为一个数组,都被调用;混入对象的钩子将在自身钩子之前调用(生命周期等)
3.值为对象的混入:如methods,components,props等,同名选项会被合并,组件对象覆盖混入对象

重新调用接口
-->