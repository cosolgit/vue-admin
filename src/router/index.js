import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

/*
  1.系统分配
  2.角色分配
  3.按钮级别分配

  工作,动态路由到底是由后台返回还是由前端配
  建议前端配置,这样才能达到前后端分离的工作
    1.后端配置路由,前端人不在的情况下,没办法页面跳转
    2.新的需求,前端把路由配置好了,后台人不在,,没办法找到路由
    (都没达到前后端分离)
*/
/*
  1.默认路由
  2.动态路由

*/

//引入布局组件
import Layout from '@/views/Layout';

//默认路由
export const defaultRouterMap=[
  {
    path: "/",
    redirect:"/login",
    hidden:true,
    meta:{
      name:"主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: ()=>import("@/views/Login"),
    hidden:true,
    meta:{
      name:"登录"
    }
  },
  {
    path: "/console",
    name: "Console",
    redirect:"/index",//不重定向默认显示的是Layout/index,重定向了才能显示children
    component: () => import("../views/Layout/index.vue"),
    meta:{
      name:"控制台",
      icon:"console"
    },
    children:[
      {
        path:"/index",
        name:"Index",
        component: () => import("../views/Console/index.vue"),
        meta:{
          name:"首页"
        }
      }
    ]
  },
  {
    path: "/page404",
    hidden:true,
    component: () => import("../views/Layout/index.vue"),
    meta:{
      name:"404",
      icon:"404"
    },
    children:[
      {
        path:"/404",
        name:"404",
        component: () => import("../views/404.vue"),
        meta:{
          name:"404"
        }
      }
    ]
  },
];

//动态路由
export const asyncRouterMap=[
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta:{
      role:["sale"],
      system:"infoSystem",
      name:"信息管理",
      icon:"info"
    },
    children:[
      {
        path:"/infoIndex",
        name:"InfoIndex",
        component: () => import("../views/Info/index.vue"),
        meta:{
          keepAlive:true,
          role:["sale"],
          name:"信息列表",
        }
      },
      {
        path:"/infoCategory",
        name:"InfoCategory",
        component: () => import("../views/Info/category.vue"),
        meta:{
          keepAlive:true,
          role:["sale"],
          name:"信息分类"
        }
      },
      {
        path:"/infoDetailed",
        name:"InfoDetailed",
        component: () => import("../views/Info/detailed.vue"),
        hidden:true,
        meta:{
          keepAlive:true,
          role:["sale"],
          name:"信息详情"
        }
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "user",
    component: Layout,
    meta:{
      role:["sale"],
      system:"userSystem",
      name:"用户管理",
      icon:"user"
    },
    children:[
      {
        path:"/userIndex",
        name:"UserIndex",
        component: () => import("../views/User/index.vue"),
        meta:{
          role:["sale"],
          name:"用户列表"
        }
      }
    ]
  },
  {path: "*",redirect:"/404",hidden:true},
];

export default new Router({
  routes : defaultRouterMap
})