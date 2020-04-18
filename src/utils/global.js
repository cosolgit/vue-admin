import { MessageBox } from 'element-ui';
/**
 * 全局定义方法
 * 全局注册多文件调用
 *   vue2.0
 * export default {
 *   install(Vue,options){
 *      Vue.prototype.xxx=()=>{}
 *   }
 * }
 * 
 * 定义单独的方法,调用时需要引入 import 
 * export function xxxx(){}
 * 
 *   vue3.0
 * 
 * export function global() {
 *      const aaa=()=>{}
 *      const bbb=ref();
 *      return {
 *          aaa,bbb
 *      }
 * }
 */
export default {
    install(Vue, options) {
        //注册全局方法
        Vue.prototype.confirm =(params)=>{
            MessageBox.confirm(params.content, params.tip||'提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: params.type||'warning',
                center: true
            }).then(() => {
                params.fn&&params.fn(params.id);
            }).catch(() => {
                /* root.$message({
                    type: 'info',
                    message: '已取消删除'
                }); */
            });
        },
        Vue.prototype.xxxx=()=>{

        }
    }
}

//vue插件