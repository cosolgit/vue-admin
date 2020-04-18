import Vue from "vue";
import store from "../store";
//自定义指令
Vue.directive("btnPerm",{
    bind:function(el,bingind,vnode){
      //操作DOM,操作el
      if(bingind.def.hasBtnPerm(bingind.value)){
        el.style.display="block";
        //el.className +=" xxx"不拼起来样式会被覆盖
      }
    },
    hasBtnPerm:function(permission){
      let roles=store.getters["app/roles"];
      let button=store.getters["app/buttonPermission"];
      return roles.includes("admin")?true:button.indexOf(permission)!=-1;
    }
})