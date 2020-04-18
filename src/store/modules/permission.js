import { GetUserRole } from "@/api/login";
import {defaultRouterMap,asyncRouterMap} from "@/router";

function hasPermission(roles,router){
    if(router.meta&&router.meta.role){
        return roles.some(item=>router.meta.role.indexof(item)>=0);
    }
}

const state={
    
    allRouters:defaultRouterMap,
    addRouters:[],
}
const getters={
    
    allRouters:state=>state.allRouters,
    addRouters:state=>state.addRouters,
}
const mutations={
    
    SET_ROUTER(state,value){
        state.addRouters=value;
        state.allRouters=defaultRouterMap.concat(asyncRouterMap);
    }
}
const actions={//异步获取的数据改变state需要通过mutations
    getRoles({commit}, requestData){
        return new Promise((resolve,reject)=>{
            GetUserRole().then(response=>{
                let role=response.data.data;
                resolve(role);
            }).catch(error=>{
                reject(error);
            })
        })
    },

    //创建动态路由
    createRouter({commit},data){
        return new Promise((resolve,reject)=>{
            data=data[0];
            let addRouters=[];
            //超管的处理
            if(data.includes("admin")){
                addRouters=asyncRouterMap;
            }else{
                //试下为什么这样写
                addRouters=asyncRouterMap.filter(item=>{

                    if(hasPermission(data,item)){
                        
                        if(item.children&&item.children.length>0){
                            item.children=item.children.filter(child=>{
                                if(hasPermission(data,child)){
                                    return child;
                                }
                            })
                            return item
                        }
                        return item;
                    }
                   
                });
                //将路由最后一项塞进来
                addRouters.push(asyncRouterMap[asyncRouterMap.length-1]);
            }
            commit("SET_ROUTER",addRouters);
            resolve();
        })
    }
}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}