import {Login,Logout} from "@/api/login";
import { setToken, removeToken, removeUserName, setUserName, getUserName } from "@/utils/app";

const state={
    isCollapse: JSON.parse(window.sessionStorage.getItem('isCollapse')) || false,
    token:'',
    username:getUserName()||' ',
    roles:[],
    buttonPermission:[]
}
const getters={
    isCollapse: state => state.isCollapse,
    roles:state=>state.roles,
    buttonPermission:state=>state.buttonPermission,
}
const mutations={
    SET_ROLES(state,value){
        state.roles=value;
    },
    SET_BUTTON(state,value){
        state.buttonPermission=value;
    },
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;

        //Cookie.set('isCollapse',JSON.stringify(state.isCollapse));
        //html5本地存储
        window.sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state,value){
        state.token=value
    },
    SET_USERNAME(state,value){
        state.username=value
    }
}
const actions={
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            Login(requestData).then(response => {
                //token ,username
                let data=response.data.data;
                //存在vuex
                content.commit('SET_TOKEN',data.token);
                content.commit('SET_USERNAME',data.username);
                //存在cookie
                setToken(data.token);
                setUserName(data.username);
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        })
    },
    logout({commit}){
        return new Promise((resolve,reject)=>{
            Logout().then(response=>{
                removeToken();
                removeUserName();
                commit("SET_TOKEN","");
                commit("SET_USERNAME","");
                commit("SET_ROLES","");
                resolve(response.data);
            })
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