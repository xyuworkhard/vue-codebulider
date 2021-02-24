import Vue from 'vue'
import { loadScriptQueue } from '@/utils/loadScript'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'
import UpLoad from "@/components/_New_comPonents/l_upload"
import Grid from "@/components/_New_comPonents/l_grid/demo.vue"

Vue.component('tinymce', Tinymce)
Vue.component('uploader', UpLoad)
Vue.component('grid', Grid)
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
const $previewApp = document.getElementById('previewApp')
const childAttrs = {
  file: '',
  dialog: ' width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false" '
}

window.addEventListener('message', init, false)

function buildLinks(links) {
  let strs = ''
  links.forEach(url => {
    strs += `<link href="${url}" rel="stylesheet">`
  })
  return strs
}

function init(event) {
  if (event.data.type === 'refreshFrame') {
    const code = event.data.data
    const attrs = childAttrs[code.generateConf.type]
    let links = ''

    if (Array.isArray(code.links) && code.links.length > 0) {
      links = buildLinks(code.links)
    }

    $previewApp.innerHTML = `${links}<style>${code.css}</style><div id="app"></div>`

    if (Array.isArray(code.scripts) && code.scripts.length > 0) {
      loadScriptQueue(code.scripts, () => {
        newVue(attrs, code.js, code.html)
      })
    } else {
      newVue(attrs, code.js, code.html)
    }
  }
}

function newVue(attrs, main, html) {
  main = eval(`(${main})`)
  main.template = `<div>${html}</div>`
  new Vue({
    components: {
      child: main
    },
    data() {
      return {
        visible: true
      }
    },
    template: `<div><child ${attrs}/></div>`
  }).$mount('#app')
}
