<template>
  <div class="initconfig">
    <el-card>
      <el-container>
        <el-aside class="aside-list" v-loading="loadTree">
          <el-tree
            :data="dataBase"
            :props="defaultProps"
            @node-click="handleNodeClick"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
          ></el-tree>
        </el-aside>
        <el-container class="show-area">
          <el-header class="search-header">
            <el-row>
              <el-col :span="12">
                <el-input
                  placeholder="请输入查询表名"
                  class="input-with-select"
                  v-model="searchInput"
                  clearable
                >
                  <el-button slot="append" icon="el-icon-search"
                    >查询</el-button
                  >
                </el-input>
              </el-col>
            </el-row>
          </el-header>
          <el-main class="show-main sheetTable">
            <el-table
              ref="singleTable"
              :data="compSheetData"
              highlight-current-row
              border
              v-loading="loading"
              @expand-change="handleExpandChange"
              :disabled="readOnlys"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="expand" width="45">
                <template slot-scope="props">
                  <el-table
                    :data="props.row.children"
                    border
                    v-loading="props.row.loadField"
                  >
                    <el-table-column type="index" width="45" align="center">
                    </el-table-column>
                    <el-table-column prop="f_column" label="字段名" width="200">
                    </el-table-column>
                    <el-table-column
                      prop="f_datatype"
                      label="数据类型"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column prop="f_length" label="长度" width="180">
                    </el-table-column>
                    <el-table-column prop="f_remark" label="说明">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="45" align="center">
              </el-table-column>
              <el-table-column
                property="name"
                label="表名"
                width="200"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="sumrows"
                label="记录数"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="reserved"
                label="使用大小"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="index_size"
                label="索引使用大小"
                width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column property="tdescription" label="说明">
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "initConfig",
  props: ["actNumber", "preStep", "nextStep"],
  data() {
    return {
      searchInput: "",
      readOnlys: true,
      //数据库，表，字段数据
      dataBase: [],
      defaultProps: {
        children: "ChildNodes",
        label: "text"
      },
      sheetData: [],
      fieldData: [],
      //请求参数
      guid: "",
      // 动画
      loading: false,
      loadTree: true,
      //多选框
      multipleSelection: []
    };
  },
  methods: {
    //多选处理
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length == 1) {
        sessionStorage.setItem("sheetName", this.multipleSelection[0].name);
        this.$emit("changeValue", 2, true, false);
        this.$emit("setRouter", "/initconfig", "/form");
        let { dataBaseId } = sessionStorage;
        this.resDataDeal(
          "/csce/learun/adms/databasetable/tableinfo",
          resData => {
            const dataFields = resData.map(item => ({
              value: item.f_column,
              label: item.f_remark
            }));
            sessionStorage.setItem("dataFields", JSON.stringify(dataFields));
          },
          {
            keyValue: dataBaseId,
            Data: this.multipleSelection[0].name
          }
        );
      } else if (this.multipleSelection.length == 0) {
        this.$emit("changeValue", 1, true, true);
      } else {
        this.$emit("changeValue", 1, true, true);
        this.$message.error({
          message: "只能选择一个主表",
          type: "error",
          duratio: 2000,
          showClose: true
        });
      }
    },
    //数据库树形处理
    handleNodeClick(data) {
      this.$emit("changeValue", 1, true, true);
      this.readOnlys = false;
      let { ChildNodes, id } = data;
      this.guid = id;
      let children = ChildNodes == null ? [] : ChildNodes;
      if (children.length == 0) {
        sessionStorage.setItem("dataBaseId", this.guid);
        this.loading = true;
        this.getDataSheet(id);
      } else {
        this.sheetData = [];
      }
    },
    //字段展示
    handleExpandChange(val, expanded) {
      let { name, loadField } = val;
      let expandedFlag = expanded.length ? true : false;
      if (expandedFlag) {
        this.getDataField(this.guid, name, val);
      } else {
        loadField = false;
      }
    },
    //封装get,post请求
    // getRequest(url, params) {
    //   return this.$axios.get(url, { params });
    // },
    // postRequest(url, data) {
    //   return this.$axios.post(url, { data });
    // },

    async resDataDeal(url, callback, params) {
      let { loginMark, token } = sessionStorage;
      let newParams = Object.assign(
        {
          loginMark,
          token
        },
        params
      );
      let {
        data: { data: resData, code, info: errinfo }
      } = await this.$axios.get(url, { params: newParams });
      if (code == 200) {
        callback(resData);
        this.loadTree = false;
        this.loading = false;
      } else {
        this.loading = false;
        this.loadTree = false;
        this.$message({
          message: errinfo,
          type: "error",
          duration: 1500,
          onClose: () => {
            sessionStorage.clear();
            this.$router.push("/");
          }
        });
      }
    },
    //获取数据库，表，字段
    getDataBase() {
      this.resDataDeal("/csce/learun/adms/databaselink/dbtreelist", resData => {
        this.dataBase = resData;
      });
    },
    getDataSheet(keyValue) {
      this.resDataDeal(
        "/csce/learun/adms/databasetable/tablelist",
        resData => {
          this.sheetData = resData;
          this.sheetData.forEach(element => {
            this.$set(element, "children", []);
            this.$set(element, "loadField", true);
          });
        },
        { keyValue }
      );
    },
    getDataField(keyValue, Data, value) {
      this.resDataDeal(
        "/csce/learun/adms/databasetable/tableinfo",
        resData => {
          value.children = resData;
          value.loadField = false;
        },
        { keyValue, Data }
      );
    },
    getDictionary() {
      // /learun/adms/dataitem/map
      // /learun/adms/dataitem/cscetree
      // /learun/adms/dataitem/details
      this.resDataDeal("/csce/learun/adms/dataitem/cscetree", resData => {
        sessionStorage.setItem("dataDictionary", JSON.stringify(resData));
      });
    },
    getSource() {
      this.resDataDeal(
        "/csce/learun/adms/datasource/map",
        resData => {
          sessionStorage.setItem("dataSource", JSON.stringify(resData));
        },
        { data: "csce_companyca" }
      );
    },
    getCodeRule() {
      this.resDataDeal(
        "/csce/learun/adms/coderule/PageQuery",
        resData => {
          const ruleData = resData.rows.map(item => ({
            label: item.F_FullName,
            value: item.F_EnCode
          }));
          sessionStorage.setItem("dataRules", JSON.stringify(ruleData));
        },
        {
          pagination: JSON.stringify({
            rows: 50,
            page: 1,
            sidx: "F_CreateDate",
            sord: "desc",
            records: 0,
            total: 0
          }),
          queryJson: JSON.stringify({ keyword: "" })
        }
      );
    }
  },
  computed: {
    compSheetData() {
      return this.sheetData.filter(item =>
        item.name.includes(this.searchInput)
      );
    }
  },
  created() {
    this.getDataBase();
    this.getDictionary();
    this.getSource();
    this.getCodeRule();
    this.$emit("changeValue", 0, true, true);
  }
};
</script>
<style lang="scss">
.initconfig {
  padding: 10px;
  /* width: 100vw;
    height: 100vh; */
  box-sizing: border-box;
}

.initconfig .aside-list,
.initconfig .show-area {
  width: 300px;
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 5px 3px;
}

.initconfig .aside-list {
  padding: 5px 3px;
  border-right: none;
}

.initconfig .search-header {
  height: 40px !important;
  margin: 5px 0;
}

.initconfig .show-main {
  padding-top: 0;
  margin-top: 15px;
}

.initconfig .show-main.sheetTable {
  height: calc(100vh - 230px);
  overflow-y: scroll;
}

.initconfig
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #409eff;
  color: #fff;
}

.initconfig .el-input-group__append button.el-button {
  color: #fff;
}

.initconfig .el-input-group__append {
  background-color: #409eff;
  border: 1px solid #409eff;
}

.initconfig ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.initconfig ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(190, 190, 190);
}

.initconfig ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(190, 190, 190);
}

.initconfig ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 10px;
}

.initconfig .el-table__expanded-cell[class*="cell"] {
  padding: 15px 45px;
}
.el-radio-button--small .el-radio-button__inner {
  padding: 9px 10px;
  font-size: 12px;
  border-radius: 0;
}
</style>
