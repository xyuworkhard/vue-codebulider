<template>
  <div
    class="editGrid"
    :class="{ isEditAble: false || !gridConfig.isEdit }"
    :style="{ width: gridConfig.width + 'px' }"
    v-if="isFresh"
  >
    <el-table
      border
      ref="multipleTable"
      :data="getTableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      class="tabBorder"
      :height="gridConfig.height || 185"
    >
      <el-table-column
        type="index"
        width="40"
        align="center"
        fixed="left"
      ></el-table-column>
      <el-table-column
        type="selection"
        width="50"
        align="center"
        fixed="left"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in gridConfig.headData"
        :key="index"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :align="item.align"
      >
        <template slot-scope="scope">
          <!-- prop,rules ,style处理校验-->
          <el-form-item
            :prop="
              gridConfig.preVerify
                ? `${gridConfig.preVerify}[${scope.$index}].${item.name}`
                : ''
            "
            :rules="ruleChecked ? ruleChecked[item.name] : {}"
            label-width="0px"
            style="margin-bottom: 0;"
          >
            <div
              :class="{
                alignFlag: item.align
                  ? item.align != 'left'
                    ? true
                    : false
                  : false,
                dirFlag: item.align == 'right' ? true : false
              }"
            >
              <el-input
                v-model="scope.row[item.name]"
                v-if="!item.type || 'input' == item.type"
                :title="scope.row[item.name]"
                placeholder="请输入"
              ></el-input>
              <div v-else>
                <el-date-picker
                  v-if="'date' == item.type"
                  v-model="scope.row[item.name]"
                  type="date"
                  placeholder="请选择"
                  value-format="yyyy-MM-dd"
                  prefix-icon="icon"
                  clear-icon="icon"
                  :title="scope.row[item.name]"
                >
                </el-date-picker>
                <Select
                  v-else-if="'select' == item.type"
                  :showcontent="item.typeData.showcontent"
                  v-model="scope.row[item.name]"
                  :action="item.typeData.action"
                  :actionUrl="item.typeData.actionurl"
                  :multiple="item.typeData.multiple"
                  :filterable="item.typeData.filterable"
                  :defoption="scope.row[item.name]"
                  :isTags="item.typeData.isTags"
                ></Select>
                <Check
                  v-else-if="'radio' == item.type"
                  :dictkey="item.typeData.dictkey"
                  :dicType="item.typeData.dicType"
                  v-model="scope.row[item.name]"
                  :action="item.typeData.action"
                  :chktype="item.typeData.chktype"
                  :portrait="item.typeData.portrait"
                  :defoption="item.typeData.defoption"
                  :iconType="item.typeData.iconType"
                ></Check>
                <Check
                  v-else-if="'checkBox' == item.type"
                  :dictkey="item.typeData.dictkey"
                  :dicType="item.typeData.dicType"
                  v-model="scope.row[item.name]"
                  :action="item.typeData.action"
                  :chktype="item.typeData.chktype"
                  :portrait="item.typeData.portrait"
                  :defoption="item.typeData.defoption"
                  :iconType="item.typeData.iconType"
                ></Check>
                <!-- <upLoader :file-type="item.typeData.fileType" :company-name="item.typeData.companyName"
                v-model="scope.row[item.name]" :key-value="item.name+scope.$index" v-else-if="'upLoader'==item.type" />-->
                <upLoader
                  :file-type="item.typeData.fileType"
                  :company-name="item.typeData.companyName"
                  :key-value="scope.row[item.name]"
                  v-else-if="'upLoader' == item.type"
                />
              </div>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
    <div class="spanBtn">
      <i class="el-icon-plus" @click="addRowData"></i>
      <!-- style处理数据一条时不可删除-->
      <i class="el-icon-minus" @click="clearRowSelection"></i>
    </div>
  </div>
</template>

<script>
import Select from "@/components/_New_comPonents/l_grid/l_select";
import Check from "@/components/_New_comPonents/l_grid/l_checkbox";
import upLoader from "@/components/_New_comPonents/l_grid/l_upload";
import axios from "axios";
export default {
  components: {
    Check,
    Select,
    upLoader
  },
  props: {
    //展示数据
    tableData: {
      type: Array,
      required: true
    },
    //表格配置项
    gridConfig: {
      type: Object,
      required: true
    },
    //校验规则
    ruleChecked: {
      type: Object
    }
  },
  data() {
    return {
      getTableData: [], //获取数据
      multipleSelection: [], //选择的数据
      getDataProp: [], //添加的对象数据的键值
      fileProp: [], //附加属性名称
      isFresh: true
    };
  },
  watch: {
    //监听表格数据
    tableData(value) {
      this.getTableData = value;
    }
  },
  created() {
    this.getTableData = this.tableData;
    this.gridConfig.headData.forEach(value => {
      this.getDataProp.push(value.name);
      if (value.type == "upLoader") {
        this.fileProp.push(value.name);
      }
    });
  },
  methods: {
    GUID() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    },
    //获取选择数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //追加数据数据
    addRowData() {
      var addOneData = {};
      this.getDataProp.forEach(val => {
        addOneData[val] = "";
        //附件标识
        this.fileProp.forEach(prop => {
          if (prop == val) {
            addOneData[prop] = prop + this.GUID();
          }
        });
      });
      this.getTableData.push(addOneData);
      this.$emit("sendBackData", this.getTableData); //backData 将操作后的数据传给父组件
    },
    //删除选中数据
    clearRowSelection() {
      if (this.ruleChecked && this.multipleSelection.length >= 1) {
        const totalLength = this.getTableData.length;
        const checkLength = this.multipleSelection.length;
        const status = this.getTableData.length == 1;
        if (status || totalLength - checkLength == 0) {
          this.$message({
            showClose: true,
            message: "请至少保留一条数据",
            type: "error",
            duration: 2 * 1000
          });
          return;
        }
      }
      this.multipleSelection.forEach(value => {
        const index = this.getTableData.findIndex(item => {
          return item == value;
        });
        this.getTableData.splice(index, 1);
      });
      this.$emit("sendBackData", this.getTableData);
      if (this.ruleChecked) {
        this.isFresh = false;
        this.$nextTick(() => {
          this.isFresh = true;
        });
      }
    }
  }
};
</script>
<style>
.editGrid {
  border: 1px solid #e2e3e5;
  margin-bottom: 15px;
  margin-top: 2px;
}

.editGrid .tabBorder {
  border-top: none;
  border-left: none;
  border-right: none;
}

.editGrid .tabBorder.el-table th > .cell {
  font-weight: 500;
  color: initial;
  font-size: 13px;
}

.editGrid .tabBorder.el-table--medium th {
  padding: 3px 0;
}

.editGrid .el-table td,
.editGrid .el-table th {
  padding: 3px 0;
}

.editGrid .el-input--mini .el-input__inner {
  height: 23px;
  line-height: 23px;
}

.editGrid .el-form-item--medium .el-form-item__content {
  height: 23px;
  line-height: 23px;
}

.editGrid .tabBorder.el-table--medium td {
  padding: 0;
}

.editGrid .tabBorder.el-table--border th:nth-last-child(2),
.editGrid .tabBorder.el-table--border td:last-child {
  border-right: none;
}

.editGrid .tabBorder.el-table--border .has-gutter th:first-child div {
  display: none;
}

.editGrid .tabBorder.el-table--border::after {
  width: 0px;
}

.editGrid .el-icon-plus:before,
.editGrid .el-icon-minus:before {
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  padding: 0 3px;
  color: #000;
}

.editGrid .tabBorder .el-select__input {
  cursor: pointer;
}

.editGrid .tabBorder .el-input__inner {
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.editGrid .tabBorder .el-date-editor.el-input,
.editGrid .tabBorder .el-select {
  width: 100%;
}

.editGrid .el-select .el-input .el-select__caret {
  display: none;
}

.editGrid .el-input--medium .el-input__icon {
  line-height: 23px;
}

.editGrid .el-input--medium .el-input__inner {
  height: 23px;
  line-height: 23px;
}

.editGrid .alignFlag .el-input__inner {
  text-align: center;
}

.editGrid .alignFlag.dirFlag .el-input__inner {
  text-align: right;
}

.editGrid .el-button--small {
  padding: 6px 10px;
}

.editGrid .spanBtn {
  margin: 6px 10px;
}

.editGrid .el-table__body tr.hover-row > td,
.editGrid .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff;
}

.editGrid .el-form-item__error {
  top: 0;
}

.isEditAble {
  pointer-events: none;
}
</style>
