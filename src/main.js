import Vue from 'vue'
import App from './App.vue'
import router from './router'
import"./plugins/element.js"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/global.css"
import './plugins/api'
import Cattable from 'vue-table-with-tree-grid'
import VueQuilEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Cattable)
Vue.use(VueQuilEditor)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//时间格式化
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal*1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

