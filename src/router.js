import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './views/Main'
import Dashboard from './views/Dashboard'
import Login from './views/Login'
import store from './store'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (store.getters.isAuthenticated) {
          next()
        } else {
          next('/login')
        }
      }
    }
  ]
})
