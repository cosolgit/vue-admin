<template>
    <el-upload
        class="avatar-uploader"
        :action="config.action"
        :data="data.uploadKey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
    <img v-if="data.imges" :src="data.imges" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
export default {
    name:"uploadImg",
    /**
        1.组件的过程要做什么事(七牛云token,显示默认图片,选择图片后渲染自身图片)
        2.最终结果要做什么?(返回选择后的图片路径)
     */
    props: {
        imgUrl: {
            type: String,
            default: ""
        },
        config: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, { root, emit }) {
        const data = reactive({
            imges:"",
            uploadKey:{
                token:"",
                key:''
            }
        });
        watch(()=>props.imgUrl,value=>{
            data.images=value;
        })
        /**
         * 获取七牛云token
         */
        const getQiniuToken=()=>{
            let requestData={
                accesskey: props.config.accesskey,
                secretkey: props.config.secretkey,
                buckety: props.config.buckety
            }
            QiniuToken(requestData).then(response=>{
                data.uploadKey.token=response.data.data.data.token;
            }).catch(error=>{})
        }
        const handleAvatarSuccess = (res, file) => {
            form.imgUrl = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
            emit("update:imgUrl",`${root.$store.getters["common/qiniuUrl"]}${res.key}`);
        };
        const beforeAvatarUpload = file => {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                root.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                root.$message.error("上传头像图片大小不能超过 2MB!");
            }
            //文件名转码
            let key = encodeURI(`${file.name}`);
            data.uploadKey.key = key;
            return isJPG && isLt2M;
        };
        onMounted(()=>{
            getQiniuToken();
        })
        return {
            data,handleAvatarSuccess,beforeAvatarUpload
        }
    }
};
</script>

<style>
</style>