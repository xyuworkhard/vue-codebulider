<template>
  <div class="gridDemo">
    <!-- backData 事件函数，子传父-->
    <Grid :tableData="tableData" @sendBackData="getBackData" :gridConfig="gridConfig"></Grid>
    <!-- <el-button @click="sumbits">提交数据</el-button> -->
  </div>
</template>
<script>
  import Grid from "@/components/_New_comPonents/l_grid";
  export default {
    name: "gridDemo",
    components: {
      Grid
    },
    data() {
      // type：input，date，select，radio，checkBox，upLoader，selectFilter
      //相对应控件类型：输入框，日期选择器，下拉框，单选框，复选框，上传控件，过滤下拉框
      return {
        //展示数据
        tableData: [
          // {
          //   csceInput: "121",
          //   csceDate: "2016-08-06",
          //   csceSelect: "31",
          //   csceRadio: "1",
          //   csceCheckBox: ["1", "2"],
          //   comments: "上海市普陀区金沙江路 1518901 1111弄",
          //   csceAnnexFile: "csceAnnexFilef518d508-4a06-74a5-d939-56742729aab9",
          //   csceAnnex: "csceAnnexf518d508-4a06-74a5-d939-56742729aab9"
          // },
          // {
          //   csceInput: "112",
          //   csceDate: "2016-08-06",
          //   csceSelect: "18",
          //   csceRadio: "0",
          //   csceCheckBox: ["0", "1"],
          //   comments: "上海市普陀区金沙江路 1518901 0000弄",
          //   csceAnnexFile: "csceAnnexFilef20d6f33-4599-79b9-08b8-670c7f7a6e59",
          //   csceAnnex: "csceAnnexf20d6f33-4599-79b9-08b8-670c7f7a6e59"
          // }
        ],
        //Grid配置项
        gridConfig: {
          //表头配置
          headData: [{
              label: "默认文本框", //必配置项,表头名称
              name: "csceInput", //必配置项，字段名称
              width: 120, //选配填
              align: "center", //选配填，默认左对齐
              type: "input" //必配置项,控件类型
            },
            {
              label: "日期选择器",
              name: "csceDate",
              width: 120,
              align: "right",
              type: "date"
            },
            {
              label: "下拉选择框",
              name: "csceSelect",
              width: 160,
              align: "center",
              type: "select",
              //select组件 具体配置参考@/components/_New_comPonents/l_select
              typeData: {
                action: "0",
                actionurl: "",
                multiple: false,
                filterable: true,
                isTags: false,
                //showcontent 必填
                showcontent: {
                  data: "CHECK_DIRECTION"
                }
              }
            },
            {
              label: "单选框",
              name: "csceRadio",
              width: 280,
              align: "center",
              type: "radio",
              //单选多选组件 具体配置参考@/components/_New_comPonents/l_checkbox
              typeData: {
                action: "0",
                actionurl: "",
                chktype: "",
                portrait: false,
                //iconType: ['el-icon-star-off', 'el-icon-star-on'],
                dicType: "CHECK_DIRECTION",
                dictkey: {},
                // defoption: "1"
              }
            },
            {
              label: "复选框",
              name: "csceCheckBox",
              width: 260,
              align: "left",
              type: "checkBox",
              //单选多选组件 具体配置参考@/components/_New_comPonents/l_checkbox
              typeData: {
                action: "0",
                actionurl: "",
                chktype: "multi",
                portrait: false,
                //iconType: ['el-icon-star-off', 'el-icon-star-on'],
                dicType: "ReimburseType",
                dictkey: {},
                // defoption: ["1", "2"]
              }
            },
            {
              label: "附件",
              name: "csceAnnex",
              type: "upLoader",
              width: 500,
              //上传组件 具体配置参考@/components/_New_comPonents/l_upload
              typeData: {
                fileType: "LOGO",
                companyName: "CSCE"
              }
            }
          ],
          isEdit: true, //选配填  是否可编辑,默认false,不可编辑
          height: 200 //选配填  table高度，默认高度185
          //width: 1200,//选配填  table宽度，默认宽度100%
        }
      };
    },
    methods: {
      //获取子组件传送的值
      getBackData(val) {
        this.tableData = val;
      },
      //提交
      sumbits() {
        console.log(this.tableData);
      }
    }
  };

</script>
<style lang="scss" scoped></style>
