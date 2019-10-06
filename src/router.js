import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './views/Main'
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
      name: 'main',
      component: Main
    },
    {
      path: '/vote',
      name: 'vote',
      component: Vote
    }
  ]
})
