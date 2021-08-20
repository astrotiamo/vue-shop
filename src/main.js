import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import ElementUI from 'element-ui'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'

import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
// Vue.use(ElementUI)

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
