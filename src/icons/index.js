import Vue from 'vue';

import SvgIcon from './SvgIcon.vue';
Vue.component('svg-icon', SvgIcon);




const req=require.context('./svg',false,/\.svg$/);//读取目录所有文件(指定目录,是否遍历所有子集目录,定义遍历文件的规则)
const requireAll=requireContext=>{
    return requireContext.keys().map(requireContext);
}
requireAll(req)