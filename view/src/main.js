// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
// import jqpaginator from 'jq-paginator'

Vue.config.productionTip = false

// 使用组件
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
