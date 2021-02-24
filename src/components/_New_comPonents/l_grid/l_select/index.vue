<template>
  <div>
    <el-select
      v-model="chooseItem"
      @change="change"
      size="mini"
      :multiple="multiple"
      :placeholder="'请选择'"
      :filterable="filterable"
      :disabled="readonly"
      :collapse-tags="isTags"
    >
      <el-option label="请选择" value></el-option>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "typeSelect",
  props: {
    //数据接口类型（数据字典：0，数据源：1，以及其他的请求接口）
    action: {
      type: [String, Number],
      default: "0"
    },
    //其他接口url
    actionUrl: {
      type: [String, Number]
    },
    //是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    //请求数据字典接口参数
    showcontent: {
      type: Object
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //默认选中元素
    defoption: {
      type: [String, Array, Number]
    },
    // chooseItem: {
    //   type: [String, Number],
    //   default: "",
    // },
    //是否禁用
    readonly: {
      type: Boolean,
      default: false
    },
    //多选时是否将选中值按文字的形式展示
    isTags: {
      type: Boolean,
      default: false
    }
  },
  // model: {
  //   prop: "chooseItem",
  //   event: "input",
  // },
  data() {
    return {
      options: [],
      //唐丹霞 06/08 下拉菜单控件引用数据基础api
      url: this.apiroute,
      dataitemUrl: "/learun/adms/dataitem/details", //数据字典接口
      datasourceUrl: "/learun/adms/datasource/map", //数据源接口
      chooseItem: null //已选中的元素
    };
  },
  watch: {
    defoption: function() {
      //当传默认选项时 给下拉框赋值
      if (this.defoption) {
        if (this.multiple) {
          this.chooseItem =
            this.defoption instanceof Array
              ? this.defoption
              : this.defoption.split(",");
        } else {
          this.chooseItem = this.defoption.toString();
        }
        this.$emit("input", this.chooseItem);
      }
    }
  },
  //本地接收方法
  created() {
    if (this.action == 0) {
      //数据字典
      this.options = this.getDictionaryVal(this.showcontent.data);
    } else if (this.action == 1) {
      //数据源
      let arr = this.getCompanyList();
      if (this.showcontent.data == "csce_companyca_bank") {
        //金融机构
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].membertype == "2") {
            arr[i].value = arr[i]["compid"];
            arr[i].text = arr[i]["compname"];
            this.options.push(arr[i]);
          }
        }
      } else if (this.showcontent.data == "csce_companyca") {
        //企业名称
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].membertype == "0") {
            arr[i].value = arr[i]["compid"];
            arr[i].text = arr[i]["compname"];
            this.options.push(arr[i]);
          }
        }
      } else {
        this.options = arr;
      }
    }
    if (this.defoption) {
      if (this.multiple) {
        this.chooseItem =
          this.defoption instanceof Array
            ? this.defoption
            : this.defoption.split(",");
      } else {
        this.chooseItem = this.defoption.toString();
      }
      this.$emit("input", this.chooseItem);
    }
  },
  methods: {
    //给父组件传递选中的值
    change() {
      debugger;
      if (this.multiple) {
        let chooseArray = this.chooseItem.filter(res => {
          return res != -1;
        });
        chooseArray = chooseArray.join(",");
        this.$emit("input", chooseArray);
      } else {
        if (this.chooseItem == "-1") {
          this.$emit("input", "");
        } else {
          this.$emit("input", this.chooseItem);
        }
      }
    },
    //清除数据
    selectReset() {
      this.chooseItem = "";
    }
  }
};
</script>

<style>
.el-select {
  width: 100%;
}
</style>
