import loadable from '@loadable/component'

const routes = [
  {
    component: loadable(() => import('pages/Home')),
    path: '/'
  },
  {
    component: loadable(() => import('pages/404'))
  }
]

export default routes
