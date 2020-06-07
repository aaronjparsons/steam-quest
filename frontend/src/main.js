import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import routes from './routes'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Buefy)

const router = new VueRouter(routes)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
