<template>
  <div id="app">
    <router-view></router-view>
    <!-- 遮罩层 -->
    <div class="my-modal" v-show="modalShow"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      modalShow: false
    }
  },
  created() {
    this.$bus.$on('shiftModalShow', () => {
      this.modalShow = !this.modalShow;
    })
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;

  ::-webkit-scrollbar {
    width: 6px;
    /*对垂直流动条有效*/
    height: 6px;
    /*对水平流动条有效*/
  }

  /*定义滚动条的轨道颜色、内阴影及圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 4px;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
    /* background-color: rosybrown; */
  }

  /*定义滑块颜色、内阴影及圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #DDDEE0;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
  }

  /*定义滑块悬停变化颜色、内阴影及圆角*/
  ::-webkit-scrollbar-thumb:hover {
    background-color: #C7C9CC;
  }
}

.my-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .8;
  background: #000;
}
</style>
