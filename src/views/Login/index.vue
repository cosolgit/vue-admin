<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.key" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
      </ul>
      <!--表单start-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"  class="login-form" size="medium">
        <el-form-item  prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item  prop="password" class="item-form">
          <label for="">密码</label>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item  prop="passwords" class="item-form" v-show="model==='register'">
          <label for="">重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        
        <el-form-item  prop="code" class="item-form">
          <label for="">验证码</label>
          <el-row :gutter="20">
            <el-col :span="15"><el-input v-model="ruleForm.code"></el-input></el-col>
            <el-col :span="9"><el-button class="block" type="success" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="loginButtonStatus" @click="submitForm('loginForm')" class="block login-btn">{{model==='login'?'登录':'注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import {GetSms,Register,Login} from '@/api/login.js';
import {reactive,ref,isRef,toRefs,onMounted} from '@vue/composition-api';
import { stripscript, validatePass, validateEmail, validateVCode } from '@/utils/validate';
export default {
  //setup是新的vue组件,用于在组件中使用composition api的入口
  setup(props,{refs,root}){
    //这里放data数据,生命周期,自定义函数
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
      //过滤后的数据
      ruleForm.password=stripscript(value);
      value=ruleForm.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePass(value)) {
        callback(new Error('密码为6到20位数字+字母'));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule,value,callback)=>{
      //如果模块值为login,直接通过
      if(model.value==='login'){callback()};
      ruleForm.passwords=stripscript(value);
      value=ruleForm.passwords;
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value!=ruleForm.password) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    }
    //验证验证码
    let validateCode = (rule, value, callback) => {
      //过滤后的数据
      ruleForm.code=stripscript(value);
      value=ruleForm.code;
      if (value === '') {
        return callback(new Error('请输入验证码'));
      }else if(validateVCode(value)){
        callback('验证码格式有误')
      }else{
        callback()
      }
    };

    //reactive:取得一个对象并返回原始对象的响应数据处理(声明对象时使用)
    const menuTab=reactive([
      {txt:'登录',current:true,type:'login'},
      {txt:'注册',current:false,type:'register'}
    ])
    //console.log(menutab);
    //表单绑定数据
    const ruleForm=reactive({
      username: 'abcd@bccto.me',
      password: 'abcd1234',
      passwords: '',
      code: ''
    })
    //表单的验证
    const rules=reactive({
      username: [
        { validator: validateUsername, trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ],
      passwords: [
        { validator: validatePasswords, trigger: 'blur' }
      ],
      code: [
        { validator: validateCode, trigger: 'blur' }
      ]
    })
    //模块值
    //ref:内部值并返回一个响应性且可变的ref对象,ref对象具有.value指向内部值的单个属性(声明基础类型)
    const model=ref('login');
    //登录按钮禁用状态
    const loginButtonStatus=ref(false);
    //验证码按钮禁用状态
    const codeButtonStatus=reactive({
      status:false,
      text:'获取验证码'
    })
    // 倒计时
    const timer = ref(null);
    //console.log(model.value)//model.value=1;

    //isRefs:检查一个对象是否是ref对象
    //toRefs:将reactive对象转换为普通对象,保证对象解构或拓展运算符不会丢失原有响应式对象的响应
    /*
      function useMousePosition(){
        const pos=reactive({
          x:0,
          y:0
        })
        return toRefs(pos);
      }
      const {x,y}=useMousePosition();
    */

   /*
    生命周期
    beforeCreate,created <----> setup()
    beforeMount,mounted,beforeUpdate,updated,beforeDestroy,destroyed          <----> onBeforeMount,onMounted...(前面加个on)
   */
    onMounted(()=>{
    })

    /*
      声明函数
      methods被移除
    */
    //切换模块
    const toggleMenu=(data=>{
      console.log(menuTab[0]);
      menuTab.forEach(item=>{
        item.current=false;
      })
      //高光
      data.current=true;
      //模块值
      model.value=data.type;
      resetFormData();
      clearCountDown();
    })
    //清除表单数据
    const resetFormData=(()=>{
      //重置表单
      refs.loginForm.resetFields();
    })
    //更新按钮状态
    const updateButtonStatus=(params=>{
      codeButtonStatus.text=params.text;          
      codeButtonStatus.status=params.status; 
    })
    const submitForm=(formName=>{
      refs[formName].validate((valid) => {
        if (valid) {
          //表单验证通过
          model.value==='login'?login():register();
        }else {
          console.log('error submit!!');
          return false;
        }  
      });
    })
    //获取验证码
    const getSms=(()=>{
      //进行提示
      if(!ruleForm.username){
        root.$message.error('邮箱不能为空！！');
        return false;
      }
      if(validateEmail(ruleForm.username)){
        root.$message.error('邮箱格式有误,请尝试重新输入');
        return false;
      }
      //请求的接口
      let responseData={
        username:ruleForm.username,
        module:model.value
      }
      //修改获取验证码按钮状态
      updateButtonStatus({
        status:true,
        text:'发送中'
      })
      GetSms(responseData).then(response=>{
        let data=response.data;
        root.$message({
          message:data.message,
          type:'success'
        })
        //启用注册按钮 
        loginButtonStatus.value=false;
        //调定时器倒计时
        countDown(60);
      }).catch(error=>{
        console.log(error);
        loginButtonStatus.value=false;
      })
    })
    //登录
    const login=(()=>{
      let requestData={
        username:ruleForm.username,
        password:ruleForm.password,
        //password:sha1(ruleForm.password),
        code:ruleForm.code,
      }
      root.$store.dispatch('app/login',requestData).then(response=>{
        console.log('登录成功')
        root.$router.push({
          name:"Console",
        })
      }).catch(error=>{
        console.log(error)
      })
      /* Login(requestData).then(response=>{
        root.$router.push({
          name:"Console",
        })
      }).catch(error=>{

      }) */
    })
    //注册
    const register=(()=>{
      let requestData={
          username:ruleForm.username,
          password:ruleForm.password,
          //password:sha1(ruleForm.password),
          code:ruleForm.code,
          module:'register'
      };
      Register(requestData).then(response=>{
        let data=response.data;
        root.$message({
          message:data.message,
          type:'success'
        });
        //注册成功
        toggleMenu(menuTab[0]);
        clearCountDown();
      }).catch(error=>{
          //失败执行的代码
      })
    })
    //倒计时
    const countDown=(number=>{
      //判断定时器是否存在,存在则清除
      if(timer.value){
        clearInterval(timer.value);
      }
      let time=number;
      timer.value=setInterval(()=>{
        time--;
        if(time===0){
          clearInterval(timer.value);
          updateButtonStatus({
            status:false,
            text:'重新获取'
          })
        }else{
          codeButtonStatus.text=`倒计时${time}秒`;
        }
      },100)
    })
    //清除倒计时
    const clearCountDown=(()=>{
      updateButtonStatus({
        text:'获取验证码',
        status:false
      }) 
      clearInterval(timer.value);
    })
    return {
      menuTab,
      ruleForm,
      rules,
      model,
      loginButtonStatus,
      codeButtonStatus,
      toggleMenu,
      submitForm,
      getSms
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, .1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form { margin-bottom: 13px; }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn { margin-top: 19px; }
}
</style>