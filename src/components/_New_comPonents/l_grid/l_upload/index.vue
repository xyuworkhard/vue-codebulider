<template>
  <div>
    <el-row :gutter="20" style="width: 100%;margin-left:0px">
      <el-col :span="14" style="padding-left:0px">
        <div class="fileList">
          <!-- <div v-for="(item,index) in fileList"> -->
          <p class="flie" v-for="(item, index) in fileLists" :key="index">
            {{ item.F_FileName }}、
          </p>
          <!-- </div> -->
        </div>
      </el-col>
      <el-col :span="10">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item style="line-height:32px">
            <el-button
              v-if="!disabled"
              type="primary"
              @click="uploader"
              size="small"
              :disabled="disabled"
              >上传</el-button
            >
          </el-form-item>
          <el-form-item style="line-height:32px">
            <el-button
              type="warning"
              @click="dowloader"
              size="small"
              class="csceshow"
              >下载</el-button
            >
          </el-form-item>
          <el-form-item style="line-height:32px">
            <el-button
              type="success"
              @click="preview(fileLists[0])"
              size="small"
              class="csceshow"
              >预览</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div v-if="uploadshow || previewshow">
      <div class="uploader" @click="allHide"></div>
      <div v-if="previewshow">
        <!-- <div class="uploader" @click="preview" style="z-index: 4;opacity: 0.3;">
      </div>-->
        <div>
          <div class="preview">
            <div class="uptitle">
              <el-row
                type="flex"
                class="row-bg"
                justify="space-between"
                bg-purple
              >
                <el-col :span="6"></el-col>
                <el-col :span="6">
                  <div
                    class="grid-content"
                    style="text-align: right;cursor: pointer;"
                    @click="close()"
                  >
                    <i class="el-icon-close"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div style="height:calc(100% - 45px);position:relative">
              <img v-if="previewtype == 'image'" :src="previewFlie" />
              <iframe
                v-else
                :src="previewFlie"
                width="100%"
                id="myiframe"
                scrolling="auto"
                frameborder="0"
                :height="iframeheight"
              >
                <head>
                  <meta
                    http-equiv="Content-Type"
                    content="text/html; charset=utf-8"
                  />
                </head>
              </iframe>
              <!-- <a v-else id="media" :href="previewFlie"></a>   -->
            </div>
          </div>
        </div>
      </div>
      <div v-if="uploadshow">
        <uploaders
          class="uploadertext"
          v-on:listenCloseClick="hide"
          :clickname="clickname"
          :fileLists="fileLists"
          v-on:fileListchange="fileListchange"
          :multiple="multiple"
          :limit="limit"
          :acceptlist="acceptlist"
          :keyValue="keyValue"
          v-on:listenpreviewClick="previewone"
          :fileType="fileType"
          :companyName="companyName"
        ></uploaders>
      </div>
    </div>
  </div>
</template>
<script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
<script type="text/javascript" src="jquery.media.js"></script>
<script>
import uploaders from "./uploaders.vue";
import axios from "axios";
var preD = function(e) {
  e.preventDefault();
};
export default {
  name: "upload",
  components: {
    uploaders
  },
  props: {
    //文件列表
    fileList: {
      type: Array
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //限制用户最多可以选择的项目数
    limit: {
      type: Number,
      default: 3
    },
    //接受上传的文件类型
    acceptlist: {
      type: String,
      default: "jpg,pdf,xlsx,png,docx"
    },
    //请求接口参数
    keyValue: {
      type: [String, Number]
    },
    //公司名
    companyName: {
      type: [String, Number]
    },
    //文件类型
    fileType: {
      type: [String, Number]
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formInline: {},
      fileLists: [], //文件列表
      uploadshow: false, //上传列表是否显示
      previewshow: false, //预览
      clickname: "", //点击的是上传还是下载，上传为uploader，下载为dowm
      previewFlie: "",
      previewtype: "",
      iframeheight: ""
      // url: "http://192.168.1.137:8089"
      // action: 'https://jsonplaceholder.typicode.com/posts/',//上传地址
      // multiple: false,//是否支持多选文件
      // limit: 1,//文件数量限制
      // acceptlist: 'jpg,pdf,xlsx,png,docx',//接受上传文件的类型
    };
  },
  watch: {
    //文件列表
    fileList: function(newVal, oldVal) {
      this.fileLists = newVal;
    },
    uploadshow() {
      if (this.previewshow == false && this.uploadshow == false) {
        document.body.style.overflow = ""; // 出现滚动条
        document.removeEventListener("touchmove", preD, { passive: false });
      } else {
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", preD, { passive: false }); // 禁止页面滑动
      }
    },
    previewshow() {
      if (this.previewshow == false && this.uploadshow == false) {
        document.body.style.overflow = ""; // 出现滚动条
        document.removeEventListener("touchmove", preD, { passive: false });
      } else {
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", preD, { passive: false }); // 禁止页面滑动
      }
    },
    keyValue() {
      //唐丹霞 06/08 上传控件引用数据基础api
      this.getUpload();
    }
  },
  created() {
    //唐丹霞 06/08 上传控件引用数据基础api
    this.getUpload();
  },
  methods: {
    //请求上传接口
    getUpload() {
      axios
        .get(
          this.apiroute +
            "//csce/learun/adms/annexes/list?data=" +
            this.keyValue
        )
        .then(res => {
          this.fileLists = res.data.data;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    //上传
    uploader() {
      this.uploadshow = true;
      this.clickname = "uploader";
    },
    //隐藏
    hide() {
      this.uploadshow = false;
    },
    //关闭
    close() {
      this.previewshow = false;
    },
    //下载
    dowloader() {
      if (this.fileLists.length == 0) {
        this.$message.error("未有可下载的内容");
      } else {
        this.uploadshow = true;
        this.clickname = "download";
      }
    },
    allHide() {
      if (this.uploadshow && this.previewshow) {
        this.previewshow = false;
      } else {
        this.previewshow = false;
        this.uploadshow = false;
      }
    },
    //给父组件传递文件列表
    fileListchange(item) {
      this.fileLists = item;
      this.$emit("input", item);
    },
    //预览
    preview(item) {
      if (this.fileLists.length == 0) {
        this.$message.error("未有可预览的内容");
      } else if (this.fileLists.length == 1) {
        //唐丹霞 06/08 上传控件引用数据基础api
        axios
          .get(
            this.apiroute +
              "//csce/learun/adms/annexes/preview?data=" +
              item.F_Id
          )
          .then(res => {
            this.previewshow = true;
            this.previewFlie = res.config.url;
            this.iframeheight =
              document.documentElement.clientHeight * 0.8 - 45 + "px";
            var keyArr = Object.keys(res.headers);
            var keyindex = keyArr.indexOf("content-type");
            this.previewtype = res.headers[keyArr[keyindex]].split("/")[0];
          })
          .catch(err => {
            this.$message.error(err);
          });
      } else {
        this.uploadshow = true;
        this.clickname = "download";
      }
    },
    //预览
    //唐丹霞 06/08 上传控件引用数据基础api
    previewone(item) {
      axios
        .get(
          this.apiroute + "//csce/learun/adms/annexes/preview?data=" + item.F_Id
        )
        .then(res => {
          this.previewshow = true;
          this.previewFlie = res.config.url;
          this.iframeheight =
            document.documentElement.clientHeight * 0.8 - 45 + "px";
          var keyArr = Object.keys(res.headers);
          var keyindex = keyArr.indexOf("content-type");
          this.previewtype = res.headers[keyArr[keyindex]].split("/")[0];
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-form-item__content {
  line-height: 32px;
}
</style>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}

.fileList {
  border: 1px solid #dcdfe6;
  width: 100%;
  height: 32px;
  line-height: 30px;
  padding: 0 15px;
  border-radius: 4px;
  text-align: left;
  overflow: auto;
}

.demo-form-inline {
  text-align: left;
}

.flie {
  margin: 0;
  display: inline-block;
  margin-right: 5px;
}

.uploader {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 25;
  background-color: rgba(0, 0, 0, 0.45);
}

.uploadertext,
.preview {
  position: fixed;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  z-index: 25;
}

.preview {
  width: 1000px;
  height: 80vh;
  background-color: white;
  border: 1px solid #e0dede;
  border-radius: 5px;
  /* overflow-y: scroll; */
  /* overflow: overlay; */
  z-index: 30;
}

.preview img {
  display: block;
  max-width: 100%;
  max-height: calc(100% - 45px);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#myiframe {
  overflow: hidden;
}

/*修改滚动条样式*/
.preview::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.preview::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.preview::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
</style>
