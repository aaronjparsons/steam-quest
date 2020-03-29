import Panel from './pages/Panel'
import Config from './pages/Config'

const routes = {
  mode: 'history',
  routes: [
    {
      path: '/panel.html',
      component: Panel
    },
    {
      path: '/config.html',
      component: Config
    }
  ]
}

export default routes