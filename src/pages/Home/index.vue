<template>
  <div class="container" v-loading="loading" element-loading-text="文件上传中" element-loading-background="#4a4a4a">
    <h1>在线视频编辑器beta</h1>
    <el-upload class="upload-demo" drag multiple action="https://yijuan.xyz:3001/upload" :http-request="upload"
      :before-upload="checkFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
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
      this.$axios({
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
        this.$cookie.setCookie({
          // 设置视频地址cookie
          url: res.data.url,
          // 设置字幕起始第一栏
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
          // 设置贴图起始第一栏
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
        this.$router.push({ path: '/editor' });
        this.loading = false;
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

  h1 {
    position: absolute;
    color: #fff;
    top: 10%;
    left: 15%;
  }
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