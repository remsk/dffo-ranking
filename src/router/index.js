import Vue from 'vue'
import Router from 'vue-router'
import VueGoodTable from 'vue-good-table'
import Ranking from '@/components/Ranking'
import Character from '@/components/Character'

Vue.use(Router)
Vue.use(VueGoodTable)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Ranking',
      component: Ranking
    },
    {
      path: '/:slug',
      name: 'Character',
      component: Character
    }
  ]
})
