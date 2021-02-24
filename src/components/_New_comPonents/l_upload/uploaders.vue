<template>
  <!-- 上传压缩包格式及大小问题 tdx 2020年6月1日 -->
  <div class="uploadeing">
    <div>
      <div class="uptitle">
        <el-row type="flex" class="row-bg" justify="space-between" bg-purple>
          <el-col :span="6">
            <div class="grid-content" style="text-align: left;">上传附件</div>
          </el-col>
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
      <div v-if="clickname == 'uploader'">
        <el-upload
          class="upload-demo"
          :action="
            apiroute +
              '//csce/learun/adms/annexes/upload?keyValue=' +
              keyValue +
              '&fileType=' +
              fileType +
              '&companyName=' +
              companyName
          "
          :on-preview="handlePreview"
          :on-success="handlesuccess"
          :multiple="multiple"
          :limit="limit"
          :on-exceed="handleExceed"
          :accept="acceptlist"
          :before-upload="before"
          :file-list="fileListd"
          :on-progress="progress"
        >
          <el-button size="small" type="primary" id="btn_file"
            >添加文件</el-button
          >
        </el-upload>
      </div>
      <div
        class="uploaderAfter"
        v-bind:style="{ height: clickname == 'download' ? '428px' : '370px' }"
      >
        <div>
          <el-row
            type="flex"
            class="row-bg uploaderList"
            v-for="(item, index) in fileListd"
            :key="index"
          >
            <el-col :span="18">
              <div class="grid-content" style="text-align: left;" size="mini">
                {{ item.F_FileName }}
              </div>
            </el-col>
            <el-col :span="6">
              <el-row>
                <!-- <a :href='item.name' :download='item.name' :id='item.uid' style="display: none;"></a> -->

                <el-button
                  type="warning"
                  icon="el-icon-download"
                  circle
                  size="mini"
                  @click="download(item)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="handleRemove(item, index)"
                  v-if="clickname == 'uploader'"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-check"
                  circle
                  size="mini"
                  v-if="clickname == 'uploader'"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-view"
                  circle
                  size="mini"
                  v-if="clickname == 'download'"
                  @click="preview(item)"
                ></el-button>
              </el-row>
            </el-col>
          </el-row>
          <el-progress
            v-if="uploaderBefore"
            :percentage="percentage"
          ></el-progress>
        </div>
      </div>
    </div>

    <div></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "uploaders",
  props: {
    //点击的是上传还是下载（上传：uploader 下载：download）
    clickname: {
      type: String
    },
    //文件列表
    fileLists: {
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
    }
  },
  data() {
    return {
      fileListd: this.fileLists, //文件列表
      uploaderBefore: "", //是否显示进度条
      percentage: "" //进度条百分比
    };
  },
  created() {
    //唐丹霞 06/08 上传控件引用数据基础api
    axios
      .get(
        this.apiroute + "//csce/learun/adms/annexes/list?data=" + this.keyValue
      )
      .then(res => {
        this.fileListd = res.data.data;
      })
      .catch(err => {
        this.$message.error(err);
      });
  },
  methods: {
    //上传成功时的钩子
    //唐丹霞 06/08 上传控件引用数据基础api
    handlesuccess(response, file, fileList) {
      axios
        .get(
          this.apiroute +
            "//csce/learun/adms/annexes/list?data=" +
            this.keyValue
        )
        .then(res => {
          this.fileListd = res.data.data;
          this.uploaderBefore = false;
          this.percentage = 0;
          this.$emit("fileListchange", this.fileListd);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    //文件列表移除文件时的钩子
    handleRemove(item, index) {
      var del = this.$confirm(`确定移除 ${item.F_FileName}？`).then(() => {
        //唐丹霞 06/08 上传控件引用数据基础api
        axios
          .post(
            this.apiroute +
              "//csce/learun/adms/annexes/delete?data=" +
              item.F_Id
          )
          .then(res => {
            this.fileListd.splice(index, 1);
            this.$emit("fileListchange", this.fileListd);
          })
          .catch(err => {
            this.$message.error(err);
          });
      });
    },
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },
    //上传
    download(item) {
      // document.getElementById(item.uid).click()
      //唐丹霞 06/08 上传控件引用数据基础api
      axios
        .get(
          this.apiroute + "//csce/learun/adms/annexes/down?data=" + item.F_Id
        )
        .then(res => {
          window.open(res.config.url);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.error(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + this.fileListd.length} 个文件`
      );
    },
    //关闭
    close() {
      this.$emit("listenCloseClick");
    },
    //上传文件之前的钩子 参数为上传的文件 若返回 false 或者返回 Promise 且被 reject 则停止上传
    before(file) {
      const isLt = file.size / 1024 / 1024 < 50;
      if (!isLt) {
        this.$message.error("上传文件大小不能超过 50MB!");
      } else {
        this.uploaderBefore = true;
        this.percentage = 0;
      }
      return isLt;
      // this.fileList.push(file)
    },
    //点击文件列表中已上传的文件时的钩子
    preview(item) {
      this.$emit("listenpreviewClick", item);
    },
    //文件上传时的钩子
    progress(event, file, fileList) {
      this.percentage = event.percent;
    }
  }
};
</script>
<style>
.uploadeing {
  width: 620px;
  height: 500px;
  background-color: white;
  border: 1px solid #e0dede;
  border-radius: 5px;
}

.uptitle {
  padding: 15px;
  line-height: 15px;
  background-color: #dad9d9;
}

.upload-demo {
  text-align: left;
  margin: 15px;
}

.upload-demo .el-upload-list {
  display: none;
}

.uploaderAfter {
  border: 1px solid #e0dede;
  border-radius: 4px;
  width: 590px;
  margin: 10px auto;
  height: 370px;
  /* overflow-y: scroll; */
}

/*修改滚动条样式*/
/* .uploaderAfter::-webkit-scrollbar{
      width:3px;
      height:10px;
    }
    .uploaderAfter::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    .uploaderAfter::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    } */
.uploaderList {
  padding: 15px;
  border-bottom: 1px solid #e0dede;
}

.el-progress {
  line-height: 3;
}
</style>
