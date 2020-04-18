<template>
    <el-dialog title="新增" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
        <el-form :model="data.form" ref="addInfoForm">
            <el-form-item label="类型" :label-width="data.formLabelWidth" prop="category">
                <el-select v-model="data.form.category" placeholder="请选择活动区域">
                    <el-option 
                        v-for="item in data.categoryOption" 
                        :key="item.id" 
                        :label="item.category_name" 
                        :value="item.id">
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="标题" :label-width="data.formLabelWidth" prop="title">
                <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="概况" :label-width="data.formLabelWidth" prop="content">
                <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="close">取 消</el-button>
          <el-button type="danger" :loading="data.submitLoading"  @click="submit">确 定</el-button>
        </div>
    </el-dialog>

</template>
<script>
import {AddInfo} from "@/api/news";
import {reactive,ref,watch} from "@vue/composition-api";
export default {
    name:'dialogInfo',
    //单项数据流,父级-->子级,不能反向修改
    props:{
        flag:{
            type:Boolean,
            default:false
        },
        category:{
            type:Array,
            default:()=>[]
        }
    },
    setup(props,{root,emit,refs}){
        const data=reactive({
            dialog_info_flag:false,    //弹窗标记
            formLabelWidth:'70px',
            submitLoading:false, //按钮加载
            form:{
                category:'',
                title:'',
                content:''
            },
            //分类下拉
            categoryOption:[]
        })
        
        //watch    当flag变化,就会触发watch执行
        watch(()=>data.dialog_info_flag=props.flag);
        /**
         * methods
         */
        const close=()=>{
            resetForm()
            data.dialog_info_flag=false;
            emit("update:flag",false);  
        }
        const openDialog=()=>{
            data.categoryOption=props.category;
        }
        const resetForm = () => {
            refs.addInfoForm.resetFields();//标签要加prop
            /* data.form.category = '';
            data.form.title = '';
            data.form.content = ''; */
        }
        const submit=()=>{
            let requestData={
                category:data.form.category,
                title:data.form.title,
                content:data.form.content
            }
            if(!data.form.category){
                root.$message({
                    message: '分类不能为空！！',
                    type: 'error'
                })
                return false;
            }
            data.submitLoading=true;
            AddInfo(requestData).then(response=>{
                let responseData=response.data;
                root.$message({
                    message: responseData.message,
                    type: 'success'
                })
                data.submitLoading=false;
                close()
            }).catch(error=>{
                data.submitLoading=false;
            })
        }
        return {
            data,
            //methods,
            close,openDialog,submit
        }

    }
    
    
};
</script>
<style lang="scss" scoped>
</style>