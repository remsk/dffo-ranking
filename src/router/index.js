import Vue from 'vue'
import Router from 'vue-router'
import VueGoodTable from 'vue-good-table'

import FAQ from '@/components/FAQ'
import Ranking from '@/components/Ranking'
import NotFound from '@/components/NotFound'
import Character from '@/components/Character'
import Characters from '@/components/Characters'

Vue.use(Router)
Vue.use(VueGoodTable)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ranking',
      component: Ranking
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
    },
    {
      path: '/all',
      name: 'characters',
      component: Characters
    },
    {
      path: '/:slug',
      name: 'character',
      component: Character
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
})
