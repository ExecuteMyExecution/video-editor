<template>
  <div class="container" v-loading="loading" element-loading-text="文件上传中" element-loading-background="#4a4a4a">
    <el-upload class="upload-demo" drag multiple action="https://yijuan.xyz:3001/upload" :http-request="upload"
      :before-upload="checkFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: false,
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }
  },
  methods: {
    // 上传视频之前的回调
    checkFile(file) {
      if (file.type != 'video/mp4') {
        this.$message.error({
          message: '请上传正确的视频格式！',
          duration: 1000
        });
        return false;
      }
    },
    // 自定义事件，可覆盖默认的上传行为
    upload(file) {
      // 上传开始展示loading
      this.loading = true;
      // 新建一个FormData对象
      let formData = new FormData();
      formData.append('file', file.file);
      // 发送axios请求
      axios({
        method: 'post',
        url: 'https://yijuan.xyz:3001/upload',
        data: formData,
      }).then(res => {  // 成功后的回调 --> 跳转编辑页
        if (res.status == 200) {
          // 上传成功隐藏loading
          this.loading = false;
          this.$message.success({
            message: '视频上传成功',
            duration: 1000
          });
        }
        // 设置视频地址cookie
        this.cookie.setCookie({
          url: res.data.url,
          captions: [
            {
              index: 0,
              startTime: null,
              endTime: null,
              position: null,
              color: null,
              size: null,
              content: null
            },
          ],
          images: [
            {
              index: 0,
              startTime: null,
              endTime: null,
              position: null,
              angle: null,
              size: null,
              content: null
            },
          ]
        }, 1);
        // this.cookie.setCookie()
        this.$router.push({ path: '/editor' });
      }).catch(err => {
        // 上传成功隐藏loading
        this.loading = false;
        this.$message.error({
          message: '视频上传失败，请重试',
          duration: 1000
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #1a1a1a;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #4a4a4a;

  ::v-deep .el-upload {
    .el-upload-dragger {
      background-color: #373737;

      .el-upload__text {
        color: #fff;
      }
    }
  }

  .el-upload__tip {
    color: #fff !important;
  }
}
</style>