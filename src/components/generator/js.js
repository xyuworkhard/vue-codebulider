import { isArray } from 'util'
import { exportDefault, titleCase, deepClone } from '@/utils/index'
import ruleTrigger from './ruleTrigger'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
  confGlobal = formConfig = deepClone(formConfig)
  const dataList = []
  const ruleList = []
  const optionsList = []
  const propsList = []
  const methodList = mixinMethod(type)
  const uploadVarList = []
  const created = []
  const componentList = []
  formConfig.fields.forEach(el => {
    buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created, componentList)
  })

  const script = buildexport(
    formConfig,
    type,
    dataList.join('\n'),
    ruleList.join('\n'),
    optionsList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    methodList.join('\n'),
    created.join('\n'),
    componentList.join(',')
  )
  confGlobal = null
  return script
}

// 构建组件属性
function buildAttributes(scheme, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created, componentList) {
  const config = scheme.__config__
  const slot = scheme.__slot__
  buildData(scheme, dataList)
  buildRules(scheme, ruleList)
  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList)
    if (config.dataType === 'dynamic') {
      const model = `${scheme.__vModel__}Options`
      const options = titleCase(model)
      const methodName = `get${options}`
      buildOptionMethod(methodName, model, methodList, scheme)
      callInCreated(methodName, created)
    }
    if (config.dataType === 'sourceData') {

      const model = `${scheme.__vModel__}Options`
      const options = titleCase(model)
      const methodName = `get${options}`
      //1数据字典，2数据源
      if (config.dataOrigin == '1') {
        buildDataOrigin(methodName, model, methodList, config.dictionaryCode, '1')
      } else if (config.dataOrigin == '2') {
        buildDataOrigin(methodName, model, methodList, '', '2')
      } else {

      }
      callInCreated(methodName, created)
    }
    if (config.dataType === 'citySelect') {
      const model = `${scheme.__vModel__}Options`
      const options = titleCase(model)
      const methodName = `get${options}`
      buildCityOptionMethod(methodName, model, methodList)
      callInCreated(methodName, created)
    }
  }
  //处理编码规则
  if (config.tagIcon == "code") {
    const model = scheme.__vModel__
    const options = titleCase(model)
    const methodName = `get${options}`
    const code = scheme.__config__.codeValue
    buildDataCodeRule(methodName, model, methodList, code)
    callInCreated(methodName, created)
  }
  //处理自定义表格
  if (config.tag == "grid") {
    buildOptions(scheme, optionsList)
    const methodName = `get${scheme.__vModel__}BackData`
    let str = `${methodName}(value) {
              this.${confGlobal.formModel}.${scheme.__vModel__} = value
            },`
    methodList.push(str)
    componentList.push('grid')

  }
  if (config.tag == "uploader") {
    componentList.push('uploader')
  }
  //处理表格
  if (scheme.tableMark) {
    buildOptions(scheme, optionsList)
    //todo
    if (config.dataType === 'dynamic' || (config.dataType === 'static' && config.tagIcon === 'table') || config.dataType === 'tableBtn') {
      const model = `${scheme.__vModel__}TableData`
      const options = titleCase(model)
      const methodName = `get${options}`
      buildOptionMethod(methodName, model, methodList, scheme)
      callInCreated(methodName, created)
    }
  }
  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList)
  }

  // 处理el-upload的action
  if (scheme.action && config.tag === 'el-upload') {
    uploadVarList.push(
      `${scheme.__vModel__}Action: '${scheme.action}',
      ${scheme.__vModel__}fileList: [],`
    )
    methodList.push(buildBeforeUpload(scheme))
    // 非自动上传时，生成手动上传的函数
    if (!scheme['auto-upload']) {
      methodList.push(buildSubmitUpload(scheme))
    }
  }

  // 构建子级组件属性
  if (config.children) {
    config.children.forEach(item => {
      buildAttributes(item, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created)
    })
  }
}
//数据methods
function buildDataOrigin(methodName, model, methodList, code, type) {
  let str = ''
  if (type == '2') {
    str = `${methodName}() {
              this.${model} = this.getCompanyList()
            },`
  } else {
    str = `${methodName}() {
              this.${model} = this.getDictionaryVal('${code}')
            },`
  }

  methodList.push(str)
}
//coderules
function buildDataCodeRule(methodName, model, methodList, code) {
  let str = `${methodName}() {
    //自行导入getNumber方法--csce项目--import { getNumber} from "@/api/csce/getNumber"
              this.${confGlobal.formModel}.${model} = getNumber('${code}')
            },`
  methodList.push(str)
}
//cityOptions
function buildCityOptionMethod(methodName, model, methodList) {
  // regionData
  const str = `${methodName}() {
              this.${model} = regionData
            },`
  methodList.push(str)
}
// 在Created调用函数
function callInCreated(methodName, created) {
  created.push(`this.${methodName}()`)
}

// 混入处理函数
function mixinMethod(type) {
  const list = [];
  const minxins = {
    file: confGlobal.formBtns ? {
      submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
         
        })
      },`,
      resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`
    } : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
      close: `close() {
        this.$emit('update:visible', false)
      },`,
      handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
    }
  }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

// 构建data
function buildData(scheme, dataList) {
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  if (config.tagIcon == "code") {
    config.defaultValue = ""
  }
  let defaultValue = JSON.stringify(config.defaultValue)
  //todo data
  dataList.push(`${scheme.__vModel__}: ${defaultValue},//${config.label}`)
}

// 构建校验规则
function buildRules(scheme, ruleList) {
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = isArray(config.defaultValue) ? 'type: \'array\',' : ''
      let message = isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}不能为空`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
    }
    if (config.regList && isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern) {
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${ruleTrigger[config.tag]}' }`
          )
        }
      })
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(',')}],`)
  }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  let { options, data } = scheme
  if (scheme.tableMark) {
    data = []
    const str = `${scheme.__vModel__}TableData: ${JSON.stringify(data)},`
    optionsList.push(str)
  } else if (scheme.tableEditMark) {
    const str = `//配置参考表格组件
    table${scheme.__vModel__}Data:[],
    grid${scheme.__vModel__}Config: {
        headData: [
          //数据根据需要自行配置
          {
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
              dicType: "CHECK_DIRECTION",
              dictkey: {},
              defoption: "1"
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
              dicType: "ReimburseType",
              dictkey: {},
              defoption: ["1", "2"]
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
      },`
    optionsList.push(str)
  }
  else {
    if (!options) options = scheme.__slot__.options
    //todo 
    if (scheme.__config__.dataType === 'dynamic' || scheme.__config__.dataType === 'sourceData' || scheme.__config__.dataType === 'citySelect') { options = [] }
    const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`
    optionsList.push(str)
  }
}

function buildProps(scheme, propsList) {
  const str = `${scheme.__vModel__}Props: ${JSON.stringify(scheme.props.props)},`
  propsList.push(str)
}

// el-upload的BeforeUpload
function buildBeforeUpload(scheme) {
  const config = scheme.__config__
  const unitNum = units[config.sizeUnit]; let rightSizeCode = ''; let acceptCode = ''; const
    returnList = []
  if (config.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${config.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${config.fileSize}${config.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (scheme.accept) {
    acceptCode = `let isAccept = new RegExp('${scheme.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${scheme.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  const str = `${scheme.__vModel__}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}

// el-upload的submit
function buildSubmitUpload(scheme) {
  const str = `submitUpload() {
    this.$refs['${scheme.__vModel__}'].submit()
  },`
  return str
}
function buildOptionMethod(methodName, model, methodList, scheme) {
  // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
  const config = scheme.__config__
  const str = `${methodName}() {
    this.$axios({
      method: '${config.method}',
      url: '${config.url}'
    }).then(resp => {
      var { data } = resp
      this.${model} = data.code ? data.data.${config.dataPath} : data.${config.dataPath}
    })
  },`
  methodList.push(str)
}

// js整体拼接
function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, methods, created, complist) {
  const str = `${exportDefault}{
  ${inheritAttrs[type]}
  components: {${complist}},//如有组件,组件按路径自行导入
  props: [],
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${props}
    }
  },
  computed: {},
  watch: {},
  created () {
    ${created}
  },
  mounted () {},
  methods: {
    ${methods}
  }
}`
  return str
}
