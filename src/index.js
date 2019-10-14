import Vue from 'vue'
window.app = window.parent.app;

import lang from 'ser/lang'
import App from './app.vue'
//组件按需加载
//https://element.eleme.cn/#/zh-CN/
// import { 
//   Carousel, //走马灯，效果不错。
//   CarouselItem
// } from 'element-ui'

// Vue.use(Carousel);
// Vue.use(CarouselItem);

app.linkplugin.getEnvVar(function(env){
  env.specialUri = JSON.parse(env.allServerPaths).specialUri;
  window.env = env;
  window.i18n = lang[env.language];

  new Vue({
    el: '#app',
    render: h => h(App)
  })
})
