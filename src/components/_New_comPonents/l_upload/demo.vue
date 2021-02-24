<template>
  <upload
    :multiple="frameData.multiple"
    :file-type="frameData.fileType"
    :company-name="frameData.companyName"
    :limit="frameData.limit"
    :acceptlist="frameData.acceptlist"
    :key-value="frameData.keyValue"
    v-model="frameData.fileListchange"
  />
</template>

<script>
import axios from 'axios';
import upload from '@/components/_New_comPonents/l_upload';
export default {
  name: 'uploadDemo',
  components: {
    upload,
  },
  data() {
    return {
      frameData: {
        //fileList: [], // 数据列表,对上传组件操作后返回数据
        multiple: false, // 是否支持多选文件，非必传
        limit: 3, // 文件数量限制
        acceptlist: 'jpg,pdf,xlsx,png,docx', // 接受上传文件的类型
        keyValue: '5f6c5a3f-8902-4c3f-9e34-25796fe8c5cc', // 文件夹id
        fileType: 'Logo1571116925257', // 文件分类
        companyName: 'db1ecd5c-a79d-49ab-b7a4-cddf111c7b3a', // 公司名称
        fileListchange: '',
      },
    };
  },
  created() {},
  methods: {
    // fileListchange(item) {
    //   this.fileList = item
    // }
  },
};
</script>
  <style scoped>
</style>
