<template>
  <div class="container">
    <!-- 插入字幕选项 -->
    <InsertCaption :input="$refs.insertInput" :video="videoRelated.video" />
    <!-- 插入贴图选项 -->
    <InsertImage :video="videoRelated.video" />
    <!-- 顶部菜单部分 -->
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#282828" text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="0" @click="operation(0)">返回首页</el-menu-item>
      <el-menu-item index="1" @click="operation(1)">设置字幕</el-menu-item>
      <el-menu-item index="2" @click="operation(2)">设置贴图</el-menu-item>
      <el-menu-item index="3" @click="operation(3)">导出视频</el-menu-item>
    </el-menu>
    <!-- 视频部分 -->
    <div class="video-part">
      <div class="origin">
        <video ref="video" @play="play" @timeupdate="playing" width="100%" :src="videoSrc" controls="true" preload="auto"
          @loadeddata="firstRender" :class="{ highlight: insertShow }" />
      </div>
      <div class="edited">
        <input type="text" ref="insertInput" :style="`font-size: ${fontSize}; color: ${fontColor}`">
        <div class="canvasContainer" ref="canvasContainer">
          <vue-drag-resize :isActive="true" :w="200" :h="200" ref="dragImg" :x="0" :y="0"
            :style="`display: ${showDragImg}; transform: rotate(${rotateAngle}deg);`" @resizing="resize"
            @dragging="resize">
            <img :src="currentUrl" alt="" style="width: 100%; height: 100%;">
          </vue-drag-resize>
          <canvas ref="c1" width="700" height="400" :class="{ highlight: insertShow, cursorText: cursorText }"
            @click="insertText">
          </canvas>
        </div>
      </div>
    </div>
    <!-- 操作区域 -->
    <div class="operation">
      <keep-alive>
        <router-view @updateCaption="updateCaption" @insert="insertCaptionOrImage"
          :video="videoRelated.video"></router-view>
      </keep-alive>
    </div>
    <!-- 导出数据的弹出框 -->
    <ExportTable :captions="videoRelated.captions" :images="videoRelated.images" />
    <!-- 图片置放区（为了获取DOM对象） -->
    <div class="showImg">
      <img v-for="(img, index) in videoRelated.images" :key="index" :src="img.content" ref="img">
    </div>
  </div>
</template>

<script>
import InsertCaption from '@/components/InsertCaption';
import InsertImage from '@/components/InsertImage';
import ExportTable from '@/components/ExportTable';
import _ from 'lodash';
export default {
  data() {
    return {
      videoSrc: '',
      videoRelated: {
        video: undefined,
        width: 0,
        height: 0,
        c1: undefined,
        ctx1: undefined,
        currTime: 0,
        captions: [
          // { index: 0, startTime: null, endTime: null, position: null, color: null, size: null, content: null}
        ],
        images: [
          {}
          // { index: 0, startTime: null, endTime: null, position: null, angle: null, size: null, content: null }
        ]
      },
      insertShow: false,  // 高亮显示
      cursorText: false,  // 文本光标
      fontColor: '#000',
      fontSize: '16px',
      currentUrl: '',
      showDragImg: 'none',
      rotateAngle: 0
    }
  },
  components: {
    InsertCaption, InsertImage, ExportTable
  },
  mounted() {
    // 初始化数据
    this.videoSrc = this.$cookie.getCookie('url');
    this.videoRelated.video = this.$refs.video;
    this.videoRelated.c1 = this.$refs.c1;
    this.videoRelated.ctx1 = this.$refs.c1.getContext('2d');

    // 从缓存中读取数据
    let captions = JSON.parse(this.$cookie.getCookie('captions')).slice();
    let images = JSON.parse(this.$cookie.getCookie('images')).slice();
    if (captions) {
      captions.pop();
      this.videoRelated.captions = captions;
    }
    if (images) {
      images.pop();
      this.videoRelated.images = images;
    }
  },
  methods: {
    // 视频加入后调用canplay渲染第一帧
    firstRender() {
      this.videoRelated.video.muted = true;
      this.videoRelated.video.play();
      this.videoRelated.video.pause();
      this.videoRelated.video.muted = false;
    },
    // 点击开始播放视频后的初始化
    play() {
      // 设置canvas的长和宽
      let ratio = this.videoRelated.video.videoWidth / this.videoRelated.video.videoHeight;
      this.videoRelated.height = 400;
      this.videoRelated.width = ratio * 400;
      this.videoRelated.c1.width = ratio * 400;
      // 设置拖拽缩放组件的宽高，保证其与canvas一致
      this.$refs.canvasContainer.style.height = 400 + 'px';
      this.$refs.canvasContainer.style.width = ratio * 400 + 'px';
      // 将每个imgDOM加入到images数组中
      this.$nextTick(() => {  // 先执行for循环载入节点，再进行加入
        for (let i = 0; i < this.videoRelated.images.length; ++i) {
          this.videoRelated.images[i].ref = this.$refs.img[i];
        }
      })
    },
    // 视频播放中的事件
    playing() {
      if (this.videoRelated.video.currentTime != 0) {
        let count = 25, that = this;
        let timer = setInterval(function () {
          if (count == 0) {
            clearInterval(timer);
          } else {
            that.renderFrame();
            count--;
          }
        }, 10)
      }
    },
    // 渲染帧函数
    renderFrame() {
      // 渲染视频帧
      this.videoRelated.ctx1.drawImage(this.videoRelated.video, 0, 0, this.videoRelated.width, this.videoRelated.height);
      let curTime = this.videoRelated.video.currentTime;  // 获取当前视频时间
      // 渲染贴图
      for (const { startTime, endTime, position, size, angle, ref } of this.videoRelated.images) {
        if (curTime >= startTime && curTime < endTime) {
          const width = size.split(',')[0], height = size.split(',')[1];
          this.videoRelated.ctx1.save();
          // 将画布从起始位置向右下移动一半宽
          this.videoRelated.ctx1.translate(+position.split(',')[0] + width / 2, +position.split(',')[1] + height / 2);
          //再旋转角度
          this.videoRelated.ctx1.rotate(angle / 180 * Math.PI);
          // 最后将画布移回来，摆正之前的位置
          this.videoRelated.ctx1.translate(-width / 2, -height / 2);
          // 最后画出来
          this.videoRelated.ctx1.drawImage(ref, 0, 0, width, height);
          // 不要忘记恢复之前的设置
          this.videoRelated.ctx1.restore();
        }
      }
      // 渲染文字
      for (const { startTime, endTime, content, position, fontSize, fontColor } of this.videoRelated.captions) {
        if (curTime >= startTime && curTime < endTime) {
          this.videoRelated.ctx1.font = `${fontSize} serif`;  // 设置字体
          this.videoRelated.ctx1.fillStyle = fontColor; // 设置颜色
          // 绘制文字
          this.videoRelated.ctx1.fillText(content, position.split(',')[0], position.split(',')[1]);
        }
      }
    },
    // 菜单操作函数
    operation(index) {
      switch (index) {
        // 返回主页
        case 0: this.$router.push({ path: '/home' }); break;
        // 添加字幕
        case 1: this.$router.push({ path: '/editor/caption' }); break;
        // 添加贴图
        case 2: this.$router.push({ path: '/editor/image' }); break;
        // 导出视频
        case 3: this.$bus.$emit('changeDialogTableVisible'); break;
      }
    },
    // 自定义的更新数组函数
    updateCaption(params) {
      // 判断是否为images
      if (Object.keys(params[0]).includes('angle')) {
        params.pop();  // 去除最后的空元素
        this.videoRelated.images = params;
        // 将每个imgDOM加入到images数组中
        this.$nextTick(() => {  // 先执行for循环载入节点，再进行加入
          for (let i = 0; i < this.videoRelated.images.length; ++i) {
            this.videoRelated.images[i].ref = this.$refs.img[i];
          }
        })
      } else {
        params.pop();
        this.videoRelated.captions = params;
      }
    },
    // 插入的设置操作
    insertCaptionOrImage(index, url) {
      this.$bus.$emit('shiftModalShow');
      this.insertShow = true;
      if (index == 2) {
        this.$bus.$emit(`showInsert2`);
        // 若为插入图片，则传递url参数
        this.currentUrl = url;
        this.showDragImg = 'block';
      } else {
        this.$bus.$emit(`showInsert1`);
        this.cursorText = true;
      }
    },
    // 插入文本
    insertText(event) {
      // 若不处于高亮状态，退出
      if (window.getComputedStyle(event.target).cursor != 'text') {
        return;
      }
      // 获取距离canvas左侧和顶部的距离
      const disLeft = event.x - this.$refs.canvasContainer.offsetLeft;
      const disTop = event.y - this.$refs.canvasContainer.offsetTop;
      const input = this.$refs.insertInput;
      input.value = '';
      input.style.visibility = 'visible';
      input.style.top = event.y - 8 + 'px';
      input.style.left = event.x + 'px';
      input.focus();
      // 设置文本位置
      this.$bus.$emit('changePosition1', `${disLeft},${disTop + 32}`);
    },
    // 拖拽缩放的函数
    resize: _.debounce(function (newRect) {
      this.$bus.$emit('changePosition2', `${newRect.left},${newRect.top}`)
      this.$bus.$emit('changeImageSize', `${newRect.width},${newRect.height}`)
    }, 200)
  },
  created() {
    // 改变字体颜色
    this.$bus.$on('changeFontColor', fontColor => {
      this.fontColor = fontColor;
    })
    // 改变字体大小
    this.$bus.$on('changeFontSize', fontSize => {
      this.fontSize = fontSize;
    })
    // 取消highlight的class
    this.$bus.$on('cancelHighlight', () => {
      this.insertShow = false;
      this.cursorText = false;
      this.showDragImg = 'none';
    })
    // 改变旋转角度
    this.$bus.$on('changeAngle', angle => {
      this.rotateAngle = angle;
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;

  // 高亮的canvas属性
  .highlight {
    position: relative;
    z-index: 1;
  }

  // 如果是插入文本，则应用这个
  .cursorText {
    cursor: text;
  }

  // 插入的按钮框属性
  .insertPop {
    position: absolute;
    top: 0;
    right: 20px;
    height: 60px;
    z-index: 1;
    line-height: 60px;

    .el-color-picker {
      // padding-top: 20px;
      margin-right: 10px;
    }

    .el-button {
      margin-left: 10px;
    }
  }

  .el-menu {
    border: none;
    display: flex;
    justify-content: center;
  }

  .video-part {
    display: flex;
    color: #cccccc;

    &>div {
      border: 1px solid #444444;
      padding: 10px;
      margin: 10px;
      background-color: #3B3B3B;
    }

    .origin {
      width: 40%;
    }

    .edited {
      flex: 1;
      overflow: hidden;

      input {
        position: absolute;
        background-color: transparent;
        z-index: 2;
        border: none;
        outline: none;
        visibility: hidden;
      }

      .canvasContainer {
        position: relative;
        overflow: hidden;
      }

      ::v-deep .vdr {
        z-index: 3 !important;
        margin: 0;
        padding: 0;
      }
    }
  }

  .operation {
    flex: 1;
    height: 0;
    border: 1px solid #444444;
    padding: 10px;
    margin: 10px;
    background-color: #3B3B3B;
    color: #fff;
  }

  .showImg {
    img {
      display: none;
    }
  }
}
</style>