<template>
  <div>
    <el-checkbox-group
      v-model="chooseItem"
      v-if="chktype == 'multi'"
      :class="iconType.length != 0 ? 'removeDefalut' : ''"
      @change="change"
    >
      <el-checkbox
        v-for="(item, index) in options"
        :label="item.value"
        :key="index"
        :style="{
          display: portrait ? 'block' : 'inline-block',
          textAlign: portrait ? 'left' : ''
        }"
      >
        <i
          v-if="iconType.length != 0"
          :class="chooseItem.includes(item.value) ? iconType[1] : iconType[0]"
          style="margin-right:5px"
        ></i>
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group
      v-model="chooseItem1"
      v-else
      :class="iconType.length != 0 ? 'removeDefalut' : ''"
      @change="change"
    >
      <el-radio
        v-for="(item, index) in options"
        :label="item.value"
        :key="index"
        :style="{
          display: portrait ? 'block' : 'inline-block',
          textAlign: portrait ? 'left' : ''
        }"
      >
        <i
          v-if="iconType.length != 0"
          :class="chooseItem1.includes(item.value) ? iconType[1] : iconType[0]"
          style="margin-right:5px"
        ></i>
        {{ item.label }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "csceCheckbox",
  props: {
    dictkey: {
      type: Object
    },
    //数据接口类型（数据字典：0，数据源：1，以及其他的请求接口）
    action: {
      type: [String, Number],
      default: "0"
    },
    //其他接口url
    indata: {
      type: [String, Number]
    },
    //请求数据字典接口参数
    dicType: {
      type: String
    },
    //单选框和复选框（单选框：不传此参数或者传空/复选框：参数值为multi）
    chktype: {
      type: String
    },
    //元素样式（true：元素独占一行显示 false：元素同排显示）
    portrait: {
      type: Boolean,
      default: false
    },
    //默认选中值
    defoption: {
      type: [String, Array]
    },
    //单选框/复选框icon
    iconType: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      options: [], //复选框/单选框数据
      chooseItem: [], //复选框选中的值
      chooseItem1: "", //单选框选中的值
      dataitemUrl: "/csce/learun/adms/dataitem/details?data=", //数据字典url
      datasourceUrl: "/csce/learun/adms/datasource/map?data=" //数据源url
    };
  },
  created() {
    if (this.dicType) {
      let dataList = undefined; //store里存的数据字典数据
      if (dataList) {
        //如果store里有对应数据 就使用store的数据
        Object.keys(dataList).forEach(item => {
          this.options.push({
            value: dataList[item].value,
            label: dataList[item].text,
            parentId: dataList[item].parentId
          });
        });
      } else {
        //store没有对应数据 从接口获取
        let queryUrl = null;
        //判断数据接口类型
        if (this.action == "0") {
          //数据字典
          queryUrl = this.dataitemUrl + this.dicType;
        } else if (this.action == "1") {
          //数据源
          queryUrl = this.datasourceUrl + this.dicType;
        } else {
          //其他请求接口
          queryUrl = this.indata + "?data=" + this.dicType;
        }
        this.getData(queryUrl);
      }
    }
  },
  mounted() {
    //若有默认选项 将默认选项放进选中的数组
    if (this.defoption) {
      if (this.chktype == "multi") {
        this.chooseItem = this.defoption;
        this.$emit("input", this.chooseItem);
      } else {
        this.chooseItem1 = this.defoption;
        this.$emit("input", this.chooseItem1);
      }
    }
  },
  methods: {
    //给父组件传递选中的值
    change() {
      if (this.chktype == "multi") {
        this.$emit("input", this.chooseItem);
      } else {
        this.$emit("input", this.chooseItem1);
      }
    },
    //清除数据
    selectReset() {
      this.chooseItem = "";
      this.chooseItem1 = "";
    },
    //请求接口数据
    getData(obj) {
      let { loginMark, token } = sessionStorage;
      obj = `${obj}&loginMark=${loginMark}&token=${token}`;
      this.$axios({
        url: obj,
        method: "get"
      }).then(res => {
        this.options = res.data.data;
        var value; //这是一个字符串
        var list;
        var iconLink;

        if (this.dictkey.value == undefined && this.action == 0) {
          //若未设置请求方式以及返回字段，则字典默认返回F_ItemValue，数据源默认返回compid，其他的需传递返回的字段
          value = "F_ItemValue";
        } else if (this.dictkey.value == undefined && this.action == 1) {
          value = "compid";
        } else {
          value = this.dictkey.value;
        }
        if (this.dictkey.name == undefined && this.action == 0) {
          //若未设置请求方式以及显示字段，则字典默认显示F_ItemName，数据源默认显示compname，其他的需传递显示的字段
          list = ["F_ItemName"];
        } else if (this.dictkey.name == undefined && this.action == 1) {
          list = ["compname"];
        } else {
          list = this.dictkey.name.split(","); //若设置多个，分割成数组
        }
        if (this.dictkey.linkIcon) {
          //若显示字段大于等于2个，则设置连接符号，若不传，则默认以-连接，
          iconLink = this.dictkey.linkIcon.split(",");
        } else {
          iconLink = ["-"];
        }
        this.options.map((item, index) => {
          item.value = item[value];
          item.label = "";
          if (list.length > 1) {
            list.map((res, index) => {
              //显示字段与连接符号拼接
              if (item.label != undefined) {
                if (index + 1 == list.length) {
                  item.label += item[res];
                } else {
                  if (iconLink[index] == undefined) {
                    item.label += item[res] + iconLink[0];
                  } else {
                    item.label += item[res] + iconLink[index];
                  }
                }
              } else {
                if (iconLink[index] == undefined) {
                  item.label = item.label + iconLink[0] + item[res];
                } else {
                  item.label = item.label + iconLink[index] + item[res];
                }
              }
            });
          } else {
            //只有一个显示字段时
            item.label = item[list[0]];
          }
          // this.chooseItem = this.options[0].value; 默认选择的，查询时不用默认选择，表单时需要默认选择，否则就得写校验
        });
      });
    }
  }
};
</script>
<style>
.removeDefalut .el-checkbox__input.is-checked .el-checkbox__inner,
.removeDefalut .el-checkbox__inner,
.removeDefalut .el-radio__input.is-checked .el-radio__inner,
.removeDefalut .el-radio__inner {
  background-color: white;
  border: none;
}

.removeDefalut .el-checkbox__input,
.removeDefalut .el-radio__inner {
  width: 0px;
}
.removeDefalut .el-checkbox__label,
.removeDefalut .el-radio__label {
  padding-left: 20px;
}
</style>
