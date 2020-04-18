<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字:</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" :selectData.sync="data.selectData"/>
              </el-col>
              <el-col :span="5">
                <el-input size="small" v-model="data.key_word" placeholder="请输入搜索关键字"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button size="small" type="danger" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="handlerAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30">
      <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
        <template v-slot:status="slotData">
          <el-switch @change="handlerSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>       
        </template>
        <template v-slot:operation="slotData">
          <el-button type="danger" size="small" @click="handlerDel(slotData.data)">删除</el-button>
          <el-button type="success" size="small" @click="handlerEdit(slotData.data)">编辑</el-button>
        </template>
        <template v-slot:tableFooterLeft>
          <el-button  size="small" @click="handlerBatchDel()">批量删除</el-button>
        </template>
      </TableVue>
      <DialogAdd :flag.sync="data.dialog_add" :editData="data.editData" @refreshTableData="refreshData"/>
      <!--  <A aaa="111" bbb="222" v-on:upaa="busEvent"/> -->
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import {UserDel,UserActives} from "@/api/user";
import {global} from "@/utils/global_V3.0";
//组件
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
import A from "./aaa";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue ,DialogAdd,A},
  setup(props,{root,refs} ){
    const {str,confirm} =global();
    const busEvent=()=>{console.log(11)}

    const userTable=ref(null);
    const data = reactive({
      updateUserStatusFlag :false,
      tableRow:{},//table数据
      dialog_add:false,
      configOption: {
        init: ["truename", "phone", "email"]
      },
      //下拉菜单
      selectData:{},
      //搜索关键字
      key_word:" ",
      editData:{},
      configTable: {
        selection: true,
        //翻页记录checkbox
        recordCheckbox: true,
        tHead: [
          { label: "邮箱/用户名", field: "username", width: 200 },
          { label: "姓名", field: "truename", width: 150 },
          { label: "地区", field: "region" },
          { label: "手机号", field: "phone" },
          { label: "角色", field: "role" },
          { label: "禁启用状态", field: "status", columnType: "slot", slotName: "status"},
          { label: "操作", columnType:"slot",slotName:"operation"},
        ],
        //请求接口
        requestData:{
          url:"getUserList",
          data:{
            pageNumber:1,
            pageSize:2
          }
        }
      }
    });

    const handlerBatchDel=()=>{
      let userId=data.tableRow.idItem;
      if(!userId||userId.length===0){
        root.$message({
          message:"请勾选需要删除的用户",
          type:"error"
        })
        return false;
      }
      confirm({
        content:"确定删除此信息",
        tip:"警告",
        fn:userDelete,
      }) 
    }
    const userDelete=()=>{
      UserDel({id:data.tableRow.idItem}).then(response=>{
        //refs.userTable.refreshData();
        refreshData();
      }).catch(error=>{})
    }

    const refreshData=()=>{
      userTable.value.refreshData();
    }
    let handlerDel=(params)=>{
      data.tableRow.idItem=[params.id];
       confirm({
        content:"确定删除此信息",
        tip:"警告",
        fn:userDelete,
      }) 
    }
    
    const handlerSwitch=(params)=>{
      if(data.updateUserStatusFlag)return false;
      data.updateUserStatusFlag=true;
      UserActives({id:params.id,status:params.status}).then(response=>{
        root.$message({
          message:response.data.message,
          type:"success"
        })
        data.updateUserStatusFlag=false;
      })
    }
    const handlerAdd = () => {
      data.dialog_add = true;
      // 子组件赋值
      data.editData = Object.assign({});
    }
    const handlerEdit=(params)=>{
      data.dialog_add = true;
      data.editData=JSON.parse(JSON.stringify(params));
    }
    const search=()=>{
      let requestData={
        [data.selectData.value]:data.key_word
      };
      refs.userTable.paramsLoadData(requestData)
    }
    let operation=(params)=>{}
    return {
      data,userTable,
      operation,handlerBatchDel,handlerDel,busEvent,handlerSwitch,refreshData,handlerEdit,handlerAdd,search
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  @include labelDom(left, 60, 40);
}
</style>
