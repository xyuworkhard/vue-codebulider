// 表单属性【右面板】
import { regionData } from 'element-china-area-data';
export const formConf = {
    formRef: 'elForm',
    formModel: 'formData',
    size: 'medium',
    labelPosition: 'right',
    labelWidth: 120,
    formRules: 'rules',
    gutter: 15,
    disabled: false,
    span: 24,
    formBtns: true
}

// 输入型组件 【左面板】
export const inputComponents = [
    {
        // 组件的自定义配置
        __config__: {
            label: '单行文本',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'input',
            defaultValue: '',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://element.eleme.cn/#/zh-CN/component/input',
            // 正则校验规则
            regList: []
        },
        // 组件的插槽属性
        __slot__: {
            prepend: '',
            append: ''
        },
        // 其余的为可直接写在组件标签上的属性
        placeholder: '请输入',
        style: { width: '100%' },
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        __config__: {
            label: '多行文本',
            labelWidth: null,
            showLabel: true,
            tag: 'el-input',
            tagIcon: 'textarea',
            defaultValue: '',
            required: true,
            layout: 'colFormItem',
            span: 24,
            regList: [],
            changeTag: true,
            document: 'https://element.eleme.cn/#/zh-CN/component/input'
        },
        type: 'textarea',
        placeholder: '请输入',
        autosize: {
            minRows: 4,
            maxRows: 4
        },
        style: { width: '100%' },
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        // 组件的自定义配置
        __config__: {
            label: '编码规则',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'code',
            defaultValue: '',
            codeValue: '',
            // required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://element.eleme.cn/#/zh-CN/component/input',
        },
        // 其余的为可直接写在组件标签上的属性
        style: { width: '100%' },
        readonly: true,
        // disabled: false
    },
    // {
    //     __config__: {
    //         label: '编辑器',
    //         showLabel: true,
    //         changeTag: true,
    //         labelWidth: null,
    //         tag: 'tinymce',
    //         tagIcon: 'rich-text',
    //         defaultValue: null,
    //         span: 24,
    //         layout: 'colFormItem',
    //         required: true,
    //         regList: [],
    //         document: 'http://tinymce.ax-z.cn'
    //     },
    //     placeholder: '请输入',
    //     height: 300, // 编辑器高度
    //     branding: false // 隐藏右下角品牌烙印
    // },
    {
        __config__: {
            label: '上传',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tagIcon: 'upload',
            tag: 'uploader',
            layout: 'colFormItem',
            defaultValue: '',
            span: 24,
            required: true,
            document: 'http://tinymce.ax-z.cn'
        }
    },
    {
        __config__: {
            label: '自定义表格',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tagIcon: 'rich-text',
            tag: 'grid',
            layout: 'colFormItem',
            defaultValue: '',
            span: 24,
            required: true,
            document: 'http://tinymce.ax-z.cn'
        },
        tableEditMark: true
    },
]

// 选择型组件 【左面板】
export const selectComponents = [{
    __config__: {
        label: '下拉选择',
        showLabel: true,
        labelWidth: null,
        tag: 'el-select',
        tagIcon: 'select',
        layout: 'colFormItem',
        span: 24,
        required: true,
        dataType: 'customData',
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }]
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
},
{
    __config__: {
        label: '级联选择',
        url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
        method: 'get',
        dataPath: 'list',
        dataConsumer: 'options',
        showLabel: true,
        labelWidth: null,
        tag: 'el-cascader',
        tagIcon: 'cascader',
        layout: 'colFormItem',
        defaultValue: [],
        dataType: 'static',
        span: 24,
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    options: [{
        id: 1,
        value: 1,
        label: '选项1',
        children: [{
            id: 2,
            value: 2,
            label: '选项1-1'
        }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
        props: {
            multiple: false,
            label: 'label',
            value: 'value',
            children: 'children'
        }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
},
{
    __config__: {
        label: '城市级联',
        // url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
        // method: 'get',
        // dataPath: 'list',
        // dataConsumer: 'options',
        showLabel: true,
        labelWidth: null,
        tag: 'el-cascader',
        tagIcon: 'city',
        layout: 'colFormItem',
        defaultValue: [],
        dataType: 'citySelect',
        span: 24,
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    options: regionData,
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
        props: {
            multiple: false,
            label: 'label',
            value: 'value',
            children: 'children'
        }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
},
{
    __config__: {
        label: '单选框组',
        labelWidth: null,
        showLabel: true,
        tag: 'el-radio-group',
        tagIcon: 'radio',
        changeTag: true,
        defaultValue: '',
        layout: 'colFormItem',
        span: 24,
        optionType: 'default',
        dataType: 'customData',
        regList: [],
        required: true,
        border: false,
        document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }]
    },
    style: {},
    size: 'medium',
    disabled: false
},
{
    __config__: {
        label: '多选框组',
        tag: 'el-checkbox-group',
        tagIcon: 'checkbox',
        defaultValue: [],
        span: 24,
        showLabel: true,
        labelWidth: null,
        layout: 'colFormItem',
        optionType: 'default',
        dataType: 'customData',
        required: true,
        regList: [],
        changeTag: true,
        border: false,
        document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
    },
    __slot__: {
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false
},
{
    __config__: {
        label: '开关',
        tag: 'el-switch',
        tagIcon: 'switch',
        defaultValue: false,
        span: 24,
        showLabel: true,
        labelWidth: null,
        layout: 'colFormItem',
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/switch'
    },
    style: {},
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false
},
{
    __config__: {
        label: '滑块',
        tag: 'el-slider',
        tagIcon: 'slider',
        defaultValue: null,
        span: 24,
        showLabel: true,
        layout: 'colFormItem',
        labelWidth: null,
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/slider'
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false
},
{
    __config__: {
        label: '时间选择',
        tag: 'el-time-picker',
        tagIcon: 'time',
        defaultValue: null,
        span: 24,
        showLabel: true,
        layout: 'colFormItem',
        labelWidth: null,
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    placeholder: '请选择',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    'picker-options': {
        selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
},
{
    __config__: {
        label: '时间范围',
        tag: 'el-time-picker',
        tagIcon: 'time-range',
        span: 24,
        showLabel: true,
        labelWidth: null,
        layout: 'colFormItem',
        defaultValue: null,
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
},
{
    __config__: {
        label: '日期选择',
        tag: 'el-date-picker',
        tagIcon: 'date',
        defaultValue: null,
        showLabel: true,
        labelWidth: null,
        span: 24,
        layout: 'colFormItem',
        required: true,
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    placeholder: '请选择',
    type: 'date',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
},
{
    __config__: {
        label: '日期范围',
        tag: 'el-date-picker',
        tagIcon: 'date-range',
        defaultValue: null,
        span: 24,
        showLabel: true,
        labelWidth: null,
        required: true,
        layout: 'colFormItem',
        regList: [],
        changeTag: true,
        document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
},
]

// 布局型组件 【左面板】
export const layoutComponents = [
    {
        __config__: {
            layout: 'rowFormItem',
            tagIcon: 'row',
            label: '行容器',
            layoutTree: true,
            document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes'
        },
        type: 'default',
        justify: 'start',
        align: 'top'
    },
    {
        __config__: {
            label: '按钮',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tag: 'el-button',
            tagIcon: 'button',
            span: 24,
            layout: 'colFormItem',
            document: 'https://element.eleme.cn/#/zh-CN/component/button'
        },
        __slot__: {
            default: '主要按钮'
        },
        type: 'primary',
        icon: 'el-icon-search',
        round: false,
        size: 'medium',
        plain: false,
        circle: false,
        disabled: false
    },
    {
        __config__: {
            layout: 'colFormItem',
            tagIcon: 'table',
            tag: 'el-table',
            document: 'https://element.eleme.cn/#/zh-CN/component/table',
            span: 24,
            formId: 101,
            renderKey: 1595761764203,
            componentName: 'row101',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            label: '表格',
            dataType: 'static',
            method: 'get',
            dataPath: 'list',
            dataConsumer: 'data',
            url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/tableData',
            children: [{
                __config__: {
                    layout: 'raw',
                    tag: 'el-table-column',
                    renderKey: 15957617660151
                },
                prop: 'name',
                label: '名称'
            },
            {
                __config__: {
                    layout: 'raw',
                    tag: 'el-table-column',
                    renderKey: 15957617660152
                },
                prop: 'date',
                label: '日期'
            },
            {
                __config__: {
                    layout: 'raw',
                    tag: 'el-table-column',
                    renderKey: 15957617660153
                },
                prop: 'address',
                label: '地址'
            },
            {
                __config__: {
                    layout: 'raw',
                    tag: 'el-table-column',
                    renderKey: 1595774496335,
                    children: [{
                        __config__: {
                            label: '按钮',
                            tag: 'el-button',
                            tagIcon: 'button',
                            layout: 'raw',
                            renderKey: 1595779809901
                        },
                        __slot__: {
                            default: '主要按钮'
                        },
                        type: 'primary',
                        icon: '',
                        round: false,
                        size: 'medium'
                    }]
                },
                label: '操作',
                flag: 'table_btnMark',
                prop: ""
            }
            ]
        },
        data: [],
        tableMark: true,
        directives: [{
            name: 'loading',
            value: true
        }],
        border: true,
        type: 'default',
        justify: 'start',
        align: 'top'
    }
]