<template>
  <div>
    <div v-if="showFlag">
      <el-row>
        <el-col :span="18">
          <el-steps :active="actNumber" style="padding: 20px 50px 5px">
            <el-step title="选择数据库"></el-step>
            <el-step title="选择数据表"></el-step>
            <el-step title="表单页面"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="6">
          <p style="text-align: center; height: 50px; line-height: 50px">
            <el-button
              type="primary"
              size="medium"
              :disabled="preStep"
              @click="preStepDeal"
              >上一步</el-button
            >
            <el-button
              type="primary"
              size="medium"
              :disabled="nextStep"
              @click="nextStepDeal"
              >下一步</el-button
            >
            <el-button
              type="primary"
              size="medium"
              @click="logout"
              style="margin-left:50px"
              plain
              >退出</el-button
            >
          </p>
        </el-col>
      </el-row>
      <router-view
        :actNumber="actNumber"
        :preStep="preStep"
        :nextStep="nextStep"
        @changeValue="setValue"
        @setRouter="getRouter"
      />
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import InitConfigVue from "./InitConfig.vue";
export default {
  data() {
    return {
      actNumber: 0,
      preStep: true,
      nextStep: true,
      preRouterLink: "/initconfig",
      nextRouterLink: "/form",
      showFlag: true
    };
  },
  methods: {
    setValue(...val) {
      const [actNumber, preStep, nextStep] = val;
      this.actNumber = actNumber != undefined ? actNumber : this.actNumber;
      this.preStep = preStep != undefined ? preStep : this.preStep;
      this.nextStep = nextStep != undefined ? nextStep : this.nextStep;
    },
    getRouter(pre, next) {
      this.preRouterLink = pre;
      this.nextRouterLink = next;
    },
    preStepDeal() {
      this.$router.push(this.preRouterLink);
    },
    nextStepDeal() {
      this.$router.push(this.nextRouterLink);
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/");
    }
  },
  mounted() {
    // 取消开始的loading动画
    const preLoader = document.querySelector("#pre-loader");
    preLoader.style.display = "none";

    // fix: firefox 下 拖拽 会新打卡一个选项卡
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = event => {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.showFlag =
          val.name == "home" || val.name == "initConfig" ? true : false;
      },
      immediate: true
    }
  }
};
</script>
