import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'
import UpLoad from "@/components/_New_comPonents/l_upload"
import Grid from "@/components/_New_comPonents/l_grid/demo.vue"
import animated from 'animate.css' // npm install animate.css --save安装，在引入

Vue.use(animated)

Vue.component('tinymce', Tinymce)
Vue.component('uploader', UpLoad)
Vue.component('grid', Grid)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.apiroute = 'http://192.168.1.59:8810'
async function getDataByCode(dataCode) {
  let { loginMark, token } = sessionStorage;
  let newParams = {
    loginMark,
    token,
    data: dataCode
  }
  let {
    data: { data: resData, code, info: errinfo }
  } = await axios.get('/csce/learun/adms/dataitem/details', {
    params: newParams
  });
  if (code == 200) {
    let newArr = [];
    let sessionStore = {};
    resData.forEach(item => {
      newArr.push({
        label: item.F_ItemName,
        value: item.F_ItemValue
      });
    });
    sessionStore[dataCode] = newArr
    sessionStorage.setItem("dictionaryOpts", JSON.stringify(sessionStore))
  } else {
    this.$message.error(errinfo);
  }
}
Vue.prototype.getDictionaryVal = function (data) {
  getDataByCode(data)

  let { dictionaryOpts } = sessionStorage;
  return JSON.parse(dictionaryOpts)[data]


};
Vue.prototype.getCompanyList = function () {
  let { dataSource } = sessionStorage;
  let newArr = [];
  let companyArr = JSON.parse(dataSource);
  companyArr.forEach(item => {
    newArr.push({
      label: item.compname,
      value: item.compid
    });
  });
  return newArr
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
