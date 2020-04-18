<template>
  <el-form :model="form" ref="form" label-width="120px">
    <el-form-item label="信息分类">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图：">
      <UploadImg :imgUrl.sync="form.imgUrl" :cofig="data.config"/>
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref, watch, onMounted,onActivated } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";
import { GetList, EditInfo } from "@/api/news";
import {QiniuToken} from "@/api/common";
//组件
import UploadImg from "@c/UploadImg";
// 富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "infoDetailed",
  components: { quillEditor },
  setup(props, { root }) {
    const data = reactive({
      config:{
        action: "http://up-z2.qiniup.com",
        accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
        secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
        buckety: "webjshtml"
      },
      category: [],
      id: "",
      editorOption: {},
      submitLoading: false,
      uploadKey:{
          token:"",
          key:''
      }
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: ""
    });
    //获取信息分类
    const getInfoCategory = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          data.category = response;
        })
        .catch(error => {
          console.log("getInfoCategory" + error);
        });
    };
    //获取当前ID的信息
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(requestData)
        .then(response => {
          let responseData = response.data.data.data[0];
          form.categoryId = responseData.categoryId;
          form.title = responseData.title;
          form.createDate = timestampToTime(responseData.createDate);
          form.content = responseData.content;
        })
        .catch(error => {
          console.log("getInfo" + error);
        });
    };
    /**
     * 保存修改数据时一定有ID
     */
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: ""
      };
      data.submitLoading = true;
      EditInfo(requestData)
        .then(response => {
          let responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success"
          });
          data.submitLoading = false;
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    
    
    onMounted(() => {
      getInfoCategory();
    });
    onActivated(()=>{
      data.id=root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
      getInfo();
    })
    return {
      data, form,
      submit,beforeAvatarUpload
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

