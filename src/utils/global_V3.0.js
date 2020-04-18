import { MessageBox } from 'element-ui';
import {reactive,ref} from "@vue/composition-api";
export  function global(){
    const str=ref('');
    const confirm=(params)=>{
        MessageBox.confirm(params.content, params.tip||'提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: params.type||'warning',
            center: true
        }).then(() => {
            params.fn&&params.fn(params.id||'');
            str.value="dsadsadsads";
        }).catch(() => {
            params.catchFn&&params.catchFn();
        });
    }
    return {
        str ,
        confirm
    }

    
}   