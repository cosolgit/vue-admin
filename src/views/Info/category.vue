<template>
    <div id="category">
        <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
        <hr class="hr-e9e9e9" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
                            <!--一级分类-->
                            <h4>
                                <svg-icon icon-class="plus"></svg-icon>
                                {{firstItem.category_name}}
                                <div class="button-group">
                                    <el-button size="mini" round type="danger" @click="editCategory({data:firstItem,type:'category_first_edit'})">编辑</el-button>
                                    <el-button size="mini" round type="success" @click="handlerAddChildren({data:firstItem,type:'category_children_add'})">添加子集</el-button>
                                    <el-button size="mini" round @click="deleteCategoryConfirm(firstItem.id)">删除</el-button>
                                </div>
                            </h4>
                            <!--二级分类-->
                            <ul v-if="firstItem.children"> 
                                <li v-for="childrenItem in firstItem.children" :key ="childrenItem.id">
                                    {{childrenItem.category_name}}
                                    <div class="button-group">
                                        <el-button size="mini" round type="danger">编辑</el-button>
                                        <el-button size="mini" round>删除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>    
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form  label-width="142px" class="form-wrap" ref="categoryForm">
                        <el-form-item label="一级分类名称" v-if="category_first_input">
                            <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称" v-if="category_children_input">
                            <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit" :loading="submit_button_loading" :disabled="submit_button_disabled">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {common} from "@/api/common";
import {global} from "@/utils/global_V3.0";
import {AddFirstCategory,GetCategory,DeleteCategory,EditCategory,AddChildrenCategory} from "@/api/news";
import {reactive,ref,onMounted,watch} from "@vue/composition-api";
export default{
    name:'infoCategory',
    setup(props,{root,refs}){
        //global
        const {confirm}=global(); 
        //common
        const {getInfoCategory,categoryItem,getInfoCategoryAll}=common();

        //ref
        const submit_button_type=ref('');
        const category_first_input = ref(true);
        const category_children_input = ref(true);
        const submit_button_loading=ref(false);
        const category_first_disabled = ref(true);
        const category_children_disabled = ref(true);
        const submit_button_disabled = ref(true);
        const deleteId=ref('');

        const category=reactive({
            item:[],
            current:[]
        })

        const form=reactive ({
            categoryName: '',
            secCategoryName: ''
        })

        /**
         * watch
         */
        watch( //默认会执行一次
            ()=>categoryItem.item,//数据源
            (newVal,oldVal)=>{
                category.item=newVal;
            }
        )
        /**
         * methods
         */
        const submit=()=>{
            if(submit_button_type.value=='category_first_add'){
                addFirstCategory();
            }
            if(submit_button_type.value=='category_first_edit'){
                editFirstCategory();
            }
            if(submit_button_type.value=='category_children_add'){
                addChildrenCategory();
            }
        }
        const addFirstCategory=()=>{
            if(!form.categoryName){
                root.$message.error("分类名称不能为空");
                return false
            }
            submit_button_loading.value=true;
            AddFirstCategory({categoryName:form.categoryName}).then(response=>{
                let data=response.data;
                if(data.resCode===0){
                    root.$message({
                        type:"success",
                        message:data.message
                    });
                    //直接push节省资源
                    category.item.push(data.data);
                    //getCategory();添加数据重新获取一遍接口比较耗资源
                }
                submit_button_loading.value=false;
                form.categoryName='';
                form.secCategoryName='';
                //refs.categoryForm.resetFields();
            }).catch(error=>{
                console.log(error);
                submit_button_loading.value=false;
                form.categoryName='';
                form.secCategoryName='';
                //refs.categoryForm.resetFields();
            })
        }
        const addFirst=(params)=>{
            submit_button_type.value=params.type;
            category_first_input.value=true;
            category_children_input.value=false;
            category_first_disabled.value=false;
            submit_button_disabled.value=false;
            //按alt+左右方向键可以返回光标上次位置
        }
        const handlerAddChildren=(params)=>{
            //更新确定按钮类型
            submit_button_type.value=params.type;
            //存储数据
            category.current=params.data;
            //禁用一级输入框
            category_first_disabled.value=true;
            //启用子级输入框
            category_children_disabled.value=false;
            //启用按钮
            submit_button_disabled.value=false;
            //显示子级输入框
            category_children_input.value=true;
            //显示一级输入框文本
            form.categoryName=params.data.category_name;
        }
        const addChildrenCategory=()=>{
            if(!form.secCategoryName){
                root.$message.error("子级分类名称不能为空");
                return false
            }
            let requestData={
                categoryName:form.secCategoryName,
                parentId: category.current.id
            }
            AddChildrenCategory(requestData).then(response=>{
                let responseData=response.data;
                root.$message({
                        type:"success",
                        message:responseData.message
                });
                getInfoCategoryAll();
                form.secCategoryName='';
            }).catch(error=>{})
        }
        const deleteCategoryConfirm=(categoryID)=>{
            deleteId.value=categoryID
            confirm({
                content:"确定删除此信息",
                tip:"警告",
                type:"warning",
                fn:deleteCategory,
                catchFn:()=>{
                    //点击取消触发confirm的catch,就会执行catchFn
                    deleteId.value='';
                },
                id:"1111"
            })
        }
        const deleteCategory=()=>{      
            DeleteCategory({categoryId:deleteId.value}).then(response=>{
                //1.用数组splice删除
                let index=category.item.findIndex(item=>item.id==deleteId.value);
                category.item.splice(index,1);
                //2.filter  数据量大消耗资源
                //category.item=category.item.filter(item=>item.id!=deleteId.value);
            }).catch(error=>{
                console.log(error)
            })
        }
        const editCategory=(params)=>{
            submit_button_type.value=params.type;
            category_first_disabled.value=false;
            category_children_input.value=false;
            submit_button_disabled.value=false;
            form.categoryName=params.data.category_name;
            //存储当前的数据对象
            //console.log(params.data);
            //因为是引用类型,所以catagory.current与当前form.item存的地址是同一个地址
            category.current=params.data;
        }
        const editFirstCategory=()=>{
            if(category.current.length==0){
                root.$message.error("未选择分类");
                return false
            }
            let requestData={
                id:category.current.id,
                categoryName:form.categoryName   //不是current.category_name传的是input中新的值
            }
            EditCategory(requestData).then(response=>{
                root.$message({
                    message:response.data.message,
                    type:'success'
                })
                /* category.item.forEach(item=>{
                    if(item.id==category.current.id){
                        //console.log(category.current,item)  //指向同一个地址
                       item.category_name=response.data.data.data.categoryName;
                    }
                })  */
                //太牛了
                //所以直接修改category.current的值就是修改form.item里面的内容
                category.current.category_name=response.data.data.data.categoryName;
                form.categoryName='';
                category.current=[];
            }).catch(error=>{})
        }
        /**
         * 生命周期
         */
        onMounted(()=>{
            getInfoCategoryAll();
        })
        return {
            //ref
            category_first_input,category_children_input,submit_button_loading,category_first_disabled, category_children_disabled, submit_button_disabled,
            //reactive
            form,category,
            //methods
            submit,addFirst,deleteCategoryConfirm,editCategory,handlerAddChildren
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
    div:first-child {
        &:before { top: 20px; }
    }
    div:last-child {
        &:before { bottom: 21px; }
    }
}
.menu-title {
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
}
.category {
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before {
        content: '';
        position: absolute;
        left: 22px;
        top: 0;
        bottom: 0;
        width: 32px;
        border-left: 1px dotted #000;
    }
    h4 {
        position: relative;
        padding-left: 40px;
    }
    svg {
        position: absolute;
        left: 14px;
        top: 15px;
        background-color: #fff;
        font-size: 17px;
    }
    li {
        position: relative;
        padding-left: 36px;
        margin-left: 24px;
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 22px;
            width: 32px;
            border-bottom: 1px dotted #000;
        }
    }
    li, h4 {
        @include webkit(transition, all .5s ease 0s);
        &:hover {
            background-color: #f3f3f3;
            .button-group { display: block; }
        }
    }
}
.button-group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;
    button { font-size: 12px; }
}
.form-wrap {
    width: 410px;
    padding-top: 26px;
}
.hr-e9e9e9 {
    width: calc(100% + 60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
} 
</style>

