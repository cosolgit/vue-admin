<template>
  <el-dialog title="新增" :visible.sync="data.dialog_info_flag" @close="close" width="630px" @open="openDialog">
    <el-form :model="data.form" ref="addInfoForm" :rules="data.rules">
      <el-form-item label="用户名" :label-width="data.formLabelWidth" prop="username">
        <el-input v-model="data.form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="data.formLabelWidth" prop="password">
        <el-input  v-model="data.form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" :label-width="data.formLabelWidth" prop="truename">
        <el-input v-model="data.form.truename" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="data.formLabelWidth" prop="phone">
        <el-input v-model.number="data.form.phone" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="地区" :label-width="data.formLabelWidth" prop="region">
        <CityPicker
          :cityPickerLevel="['province','city','area']"
          :cityPickerData.sync="data.cityPickerData"
        />
      </el-form-item>
      <el-form-item label="是否启用" :label-width="data.formLabelWidth" prop="status">
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item label="角色" :label-width="data.formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox v-for="item in data.roleItem" :key="item.id" :label="item.role">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="按钮" :label-width="data.formLabelWidth" >
       <template v-if="data.btnPerm.length>0">
          <div v-for="item in data.btnPerm" :key="item.id">
            <h4>{{item.name}}</h4>
            <template v-if="item.perm&&item.perm.length>0">
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox v-for="buttons in item.perm" :key="buttons.id" :label="buttons.value">{{buttons.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
       </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit('addInfoForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
/**
 * 弹窗---->弹窗里面有个省市区联动,拆组件---->联动组件有数据获取,就拆出去
 */
import sha1 from 'js-sha1';
import { GetRole,UserAdd,UserEdit,GetSystem,GetPermButton } from "@/api/user";
import { reactive, ref, watch, onBeforeMount } from "@vue/composition-api";
import { stripscript, validatePass, validateEmail, validateVCode } from '@/utils/validate';
//组件
import CityPicker from "@c/CityPicker";
export default {
  name: "dialogInfo",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData:{
      type: Object,
      default: ()=>{}
    }
  },
  setup(props, { root, emit, refs }) {
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if(validateEmail(value)){
        callback(new Error('用户名格式有误'));
      } else{
        callback();//true
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      /*
        业务逻辑
        1.编辑状态,
            需要检验:data.form.id存在且密码不为空时
            不需要交验:data.form.id存在且密码为空时
        2.添加状态
            data.form.id不存在
      */
      //过滤后的数据
      if(!data.form.id && !value) {
        callback();
      }
      if((data.form.id&&value)||!data.form.id){
        if(value){
          data.form.password=stripscript(value);
          value=data.form.password;
          callback();
        }
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePass(value)) {
          callback(new Error('密码为6到20位数字+字母'));
        } else {
          callback();
        }
      }
    };
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "90px",
      submitLoading: false, //按钮加载
      form: {
        username:"",
        password:"",
        truename:"",
        phone:"",
        region: "",
        status: "1",
        role: [],
        btnPerm:[],
      },
      rules:{
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        role: [
            { required: true, message: "请选择角色", trigger: 'change' }
        ]
      },
      //是否启用状态
      roleStatus: "1", //label是字符串这里也要是字符串
      //角色
      roleCode: [],
      //角色选择
      roleItem: [],
      btnPerm:[],
      //城市数据
      cityPickerData: {} 
    });

    //请求角色
    const getRole = () => {
      if(data.roleItem.length===0){
        GetRole().then(response => {
          data.roleItem = response.data.data;
        });
      }
      if(data.btnPerm.length===0){
        GetPermButton().then(response=>{
          data.btnPerm=response.data.data
        })
      }
    };

    //watch    当flag变化,就会触发watch执行
    watch(() => (data.dialog_info_flag = props.flag));
    /**
     * methods
     */
    const close = () => {
      emit('refreshTableData');
      resetForm();
      data.dialog_info_flag = false;
      emit("update:flag", false);
    };
    // 弹窗打开动画 时
    const openDialog = () => {
      getRole();
      let editData=props.editData;
      console.log(editData);
      if(editData.id){
        editData.role=editData.role?editData.role.split(","):[];
        editData.btnPerm=editData.btnPerm?editData.btnPerm.split(","):[];//不转成数组,checkbox会选中一个全部选中
        for(let key in editData){
          data.form[key]=editData[key];
        }
      }
    };
    const resetForm = () => {
      data.cityPickerData={};
      refs.addInfoForm.resetFields(); //标签要加prop
    };
    const submit = (forname) => {
      refs[forname].validate((valid) => {
        console.log(valid);
        if (valid) {
          //表单验证通过
          let requestData = Object.assign({}, data.form); //,第一层的是深拷贝第二层的role还是浅拷贝
          requestData.role = requestData.role.join();  // 数组转字符串，默认以，号隔开
          requestData.btnPerm = requestData.btnPerm.join();  // 数组转字符串，默认以，号隔开
          requestData.region = JSON.stringify(data.cityPickerData);
          /*
            添加状态:需要密码,并且加密码
            编辑状态:值存在需要密码;否则删除
          */
          if(requestData.password){
            //requestData.password=sha1(requestData.password);
            requestData.password=requestData.password;
          }
          if(data.form.id){
            if(!requestData.password){
              delete requestData.password;
            }
            console.log(requestData)
            userEdit(requestData)
          }else{
            userAdd(requestData)
          }
        }else {
          console.log('error submit!!');
          return false;
        }  
      });
    };
    const userAdd = (requestData) => {
      UserAdd(requestData).then(response => {
        let data = response.data
        root.$message({
            message: data.message,
            type: "success"
        })
        close();
      })
    }
    const userEdit = (requestData) => {
      UserEdit(requestData).then(response => {
        let data = response.data
        root.$message({
            message: data.message,
            type: "success"
        })
        close();
      })
    }
    return {
      data,
      //methods,
      close,openDialog,submit
    };
  }
};
</script>
<style lang="scss" scoped>
</style>

