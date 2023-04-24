<template>
  <div id="app">
    <router-view></router-view>
    <!-- 遮罩层 -->
    <div class="my-modal" v-show="isShow"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isShow: false
    }
  },
  created() {
    this.$bus.$on('shiftModalShow', () => {
      this.isShow = !this.isShow;
    })
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  // width: 100vw;
  // overflow: hidden;
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
