import router from "./index";//要引入路由
import {getToken} from "@/utils/app";
import store from "../store";

const whiteRouter=['/login'];

router.beforeEach((to,from,next)=>{
    if(getToken()){
        if(to.path==='/login'){
            console.log(1111)
            next();
        }else{
            //路由动态添加,分配菜单,每个角色分配不同的菜单
            /*
                思考的问题:
                1.什么时候处理动态路由:登陆之后,进入控制台(首页)之前
                2.以什么条件处理:roles的length
            */
            if(store.getters["app/roles"].length===0){
                store.dispatch("permission/getRoles").then(res=>{
                    let role=res.role;
                    let button=res.button;
                    let btnPerm=res.btnPerm;
                    store.commit("app/SET_ROLES",role);
                    store.commit("app/SET_BUTTON",button);
                    
                    store.dispatch("permission/createRouter",role).then(response=>{
                        let addRouters=store.getters["permission/addRouters"];
                        let allRouters=store.getters["permission/allRouters"];
                        //路由更新
                        router.options.routes=allRouters;
                        //添加动态路由
                        router.addRoutes(addRouters);

                        //router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成
                        next({...to,replace:true});//replace:true不会留下历史记录
                        // {...to}解构
                    })
                })
            }else{
                next();
            }
        }
        console.log("存在")
    }else{
        console.log("不存在")
        /**
         * 没有token就跳转至/login页面
         *    为了防止next('/login')出现死循环
         *      1.to.path==login,next()
         *      2.to.path!=login, next('/login')
         */
        if(whiteRouter.indexOf(to.path)!==-1){ //白名单中有,直接next
            next();    //不带参数默认指向to.path,不会触发beforeEach
        }else{        
            next('/login');   //有参数,会触发beforeEach
            /**
             * 1.直接进入index的时候,参数to变为"/index",触发路由指向,跑beforeEach
             * 2.再一次next指向了login,再次发生路由指向,再跑beforeEach,参数to变为"/login"
             * 3.白名单判断存在,则直接执行next(),因为没有参数,所以不会再次beforeEach
             * 
             */
        }
    }
})