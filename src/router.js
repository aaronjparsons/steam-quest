import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home'
import Vote from './views/Vote'

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
      name: 'home',
      component: Home
    },
    {
      path: '/vote',
      name: 'vote',
      component: Vote
    }
  ]
})
