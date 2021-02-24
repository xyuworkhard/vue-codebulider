<template>
  <div class="login">
    <div>
      <el-carousel arrow="never" class="imgs" :interval="durTime">
        <el-carousel-item v-for="item in imgList" :key="item">
          <img :src="item" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="conCenter">
      <div class="loginForm">
        <span class="title animate__animated animate__bounceInDown">
          <a href="https://cn.vuejs.org/" class="links">Vue</a>
          &<a href="https://element.eleme.cn/#/zh-CN" class="links">Element</a>
          前端代码生成器
        </span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class=" animate__animated
          animate__bounceInRight"
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              clearable
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :loading="loading"
              style="width:100%"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      durTime: 2500,
      imgList: [
        require("@/assets/bg1.jpg"),
        require("@/assets/bg2.jpg"),
        require("@/assets/bg3.jpg")
      ],
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    postRequest(url, data) {
      return this.$axios.post(url, { data });
    },
    async getLoginInfo() {
      let {
        data: { data: successData, code, info: errinfo }
      } = await this.postRequest(
        "/csce/CSCE/user/login",
        JSON.stringify({
          username: this.ruleForm.username,
          password: md5(this.ruleForm.password)
        })
      );
      if (code == 200) {
        this.loading = false;
        let {
          baseinfo: { loginMark, token }
        } = successData;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("loginMark", loginMark);
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({
            username: this.ruleForm.username,
            password: md5(this.ruleForm.password)
          })
        );
        this.$router.push("/initconfig");
      } else {
        this.$message.error(errinfo);
        this.loading = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.getLoginInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  .imgs {
    .el-carousel__indicators {
      z-index: 8;
    }
    .el-carousel__container {
      width: 100vw;
      height: 100vh;
    }
    img {
      width: 100vw;
      height: 100vh;
    }
  }
  .conCenter {
    position: absolute;
    width: 600px;
    height: 100vh;
    z-index: 5;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 50px;
    box-sizing: border-box;
    background-color: rgba(48, 49, 51, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .loginForm {
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      .title {
        display: block;
        width: 100%;
        color: #008c8c;
        margin-bottom: 40px;
        font-size: 30px;
        text-align: center;
        font-weight: 700;
        .links {
          text-decoration: none;
          color: #008c8c;
        }
      }
      .el-button--primary:focus,
      .el-button--primary:hover,
      .el-button--primary {
        background: #008c8c;
        border-color: #008c8c;
        color: #fff;
      }
    }
  }
}
</style>
