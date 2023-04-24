import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import cookie from './util/cookie';
import VueDragResize from 'vue-drag-resize'

// 注册全局组件
Vue.component('vue-drag-resize', VueDragResize)

Vue.use(ElementUI);
Vue.config.productionTip = false;
// 挂载cookie
Vue.prototype.cookie = cookie;
// 挂载$bus事件总线
Vue.prototype.$bus = new Vue();

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
