import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('body')
