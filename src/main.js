import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./router/premit";
/* //自定义全局方法
import global from "@/utils/global.js"; */
//自定义全局组件
import "./icons";

//全局注册按钮权限
import {buttonPermission} from "./utils/buttonPermission";
Vue.prototype.btnPerm=buttonPermission;

//自定义按钮指令
import "./utils/buttonPerm";

//Vue.use(global);
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;







/**
 * vue3.0两种运行模式
 *  1.compiler(模板)模式
 *  2.runtime模式(运行时)
 *  vue的默认为runtime模式,指向dist/vue.runtime.common.js位置;
 * 
 *  使用全局组件要改为模板模式,只用在config.js中将vue指向vue/dist/vue.js
 * 
 */
//runtime运行模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


/* //compiler(模板)模式
new Vue({
  el:'#app',
  router,
  store,
  template:'<App />',
  components:{App}
}) */