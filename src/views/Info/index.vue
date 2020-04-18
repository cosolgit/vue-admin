<template>
    <div>
        <el-row :gutter="14">
            <el-col :span="4">
                <div class="label-wrap category">
                    <label for="">分类：</label>
                    <div class="wrap-content">
                        <el-select v-model="category_value" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in options.category"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="label-wrap date">
                    <label for="">日期：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="date_value"
                            type="datetimerange"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['12:00:00', '08:00:00']">
                        </el-date-picker>
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <div class="label-wrap key-work">
                    <label for="">关键字：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <SelectVue :config="data.configOption"/>
                        <!-- <el-select v-model="search_key" style="width: 100%;">
                            <el-option 
                            v-for="item in search_option" 
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                            ></el-option>
                        </el-select> -->
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%;"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" style="width: 100%;" @click="getList">搜索</el-button>
            </el-col>
            <el-col :span="3" style="color:white">1&nbsp;&nbsp;</el-col>
            <el-col :span="2">
                <el-button v-if="btnPerm('info:add')"  type="danger" class="pull-right" style="width: 100%;" @click="dialog_info=true">新增</el-button>
            </el-col>
        </el-row>
        <!--表格数据-->
        <el-table :data="table_data.item" border style="width: 100%" v-loading="loadingData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="630"></el-table-column>
            <el-table-column prop="categoryId"  label="类型" width="130" :formatter="toCategory"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="237" :formatter="toDate"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-btnPerm="'info:del'"  type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
                    <el-button v-btnPerm="'info:edit'" type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
                    <el-button v-btnPerm="'info:detailed'" type="success" size="mini" @click="detailed(scope.row)">编辑详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--底部分页-->
        <el-row>
            <el-col :span="12"><el-button size="medium" @click="deleteAll">批量删除</el-button></el-col>
            <el-pagination
                class="pull-right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[5,15]"
                background
                layout="total,sizes,prev, pager, next,jumper"
                :total="total">
            </el-pagination>
        </el-row>

        <!--新增弹窗-->
        <DialogInfo :flag.sync="dialog_info" :category="options.category"/>
        <!--编辑弹窗-->
        <DialogEditInfo :flag.sync="dialog_info_edit" :id="infoId" :category="options.category" @getListEmit="getList" />
    </div>
</template>

<script>
import {AddInfo,GetList,DeleteInfo} from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import {global} from "@/utils/global_V3.0";
import {timestampToTime} from "@/utils/common";
import {common} from "@/api/common";
import {reactive,ref,watch,onMounted} from "@vue/composition-api";
//组件
import SelectVue from "@c/Select"; 
export default{
    name:'infoIndex',
    components:{DialogInfo,DialogEditInfo,SelectVue},
    setup(props,{emit,root}){
        //const {getInfoCategory,categoryItem}=common();
        const {str,confirm} =global();
        
        /**
            数据
         */
        const data=reactive({
            configOption:{
                init:["id","title"],
            },
        });
        //信息弹窗标记
        const dialog_info=ref(false);
        const dialog_info_edit=ref(false);
        const category_value=ref('');
        const date_value=ref('');
        const search_key=ref('id');
        const search_keyWork=ref('');
        const total=ref(0);
        const infoId=ref("");
        // loading
        const loadingData = ref(false);
        const deleteInfoId=ref('');
        const options=reactive({
            category:[]
        });
        const search_option=reactive([
            {value:"id",label:"ID"},
            {value:"title",label:"标题"}
        ]);
        //页码
        const page=reactive({
            pageNumber:1,
            pageSize:5
        })
        const table_data=reactive({
            item:[]
        })
        /**
         * watch
         */
        /* watch( //默认会执行一次
            ()=>categoryItem.item,//数据源
            (newVal,oldVal)=>{
                options.category=newVal;
            }
        ) */
        /**
            methods
         */
        const handleSizeChange=(val=>{
            page.pageSize=val;
            getList();
        }) 
        const handleCurrentChange=(val=>{
            page.pageNumber=val;
            getList();
        })
        const deleteItem=(id)=>{
            deleteInfoId.value=[id];
            confirm({
                content:"确定删除此信息",
                tip:"警告",
                type:"warning",
                fn:confirmDelete,
                id:"1111"
            })
              /*  root.confirm({
                   content:"确定删除此信息",
                   tip:"警告",
                   type:"warning",
                   fn:confirmDelete,
                   id:"1111"
               }); */
        }
        const deleteAll=()=>{
            if(!deleteInfoId.value||deleteInfoId.value.length==0){
                root.$message.error("请选择要删除的数据");
                return false
            }
            confirm({
                   content:"确认删除选中的数据",
                   tip:"警告",
                   fn:confirmDelete
            });
        }
        const handleSelectionChange=(val)=>{
            deleteInfoId.value=val.map(item=>item.id);
        }
        const confirmDelete=value=>{
            DeleteInfo({id:deleteInfoId.value}).then(response=>{
                deleteInfoId.value='';
                getList();
            }).catch(error=>{})
        }
        const formatData=()=>{
            let requestData={
                categoryId:category_value.value?category_value.value:'',//分类ID
                startTime:date_value.value.length>0?date_value.value[0]:'',
                endTime:date_value.value.length>0?date_value.value[1]:'',
                pageNumber:page.pageNumber,
                pageSize:page.pageSize
            }
            requestData[search_key.value]=search_keyWork.value;
            return requestData;
        }
        const getList=()=>{
            //数据处理
            let requestData=formatData();
            loadingData.value=true;
            GetList(requestData).then(response=>{
                let data=response.data.data;
                table_data.item=data.data;
                //数据总量
                total.value=data.total;
                //加载状态
                loadingData.value=false;
            }).catch(error=>{
                loadingData.value=false;
            })
        }
        //日期格式化
        const toDate=(row, column, cellValue, index)=>{
            return timestampToTime(row.createDate);
        }
        //类型转换
        const toCategory=(row, column, cellValue, index)=>{
            let categoryData=options.category.filter(item=>item.id==row.categoryId);
            if(categoryData){
                return categoryData[0].category_name
            }
        }
        //编辑
        const editInfo=(id)=>{
            infoId.value=id;
            dialog_info_edit.value=true;
        }
        //详情
        const detailed=(data)=>{
            root.$store.commit("infoDetailed/UPDATE_STATE_VALUE",{
                id:{
                    value:data.id,
                    sessionKey:"infoId",
                    session:true
                },
                title:{
                    value:data.title,
                    sessionKey:"infoTitle",
                    session:true
                }
            })
            root.$router.push({
                name:"InfoDetailed",
                params:{
                    id:data.id,
                    title:data.title
                }
            })
        }
        const getInfoCategory=()=>{
            root.$store.dispatch('common/getInfoCategory').then(response=>{
                options.category=response;
            }).catch(error=>{})
        }
        onMounted(()=>{
            getInfoCategory();
            getList();
        })
        return {
            //ref
            dialog_info,category_value,date_value,search_key,search_keyWork,total,
            loadingData,dialog_info_edit,infoId,
            //reactive
            search_option,options,table_data,data,
            //methods
            handleSizeChange,handleCurrentChange,deleteItem,deleteAll,toDate,toCategory,handleSelectionChange,
            getList,editInfo,detailed
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
    &.category { @include labelDom(left, 60, 40); }
    &.date { @include labelDom(right, 93, 40); }
    &.key-work { @include labelDom(right, 99, 40); }
}
</style>

