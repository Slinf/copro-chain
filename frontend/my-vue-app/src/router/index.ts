import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/proposal/:id',
      name: 'ProposalDetail',
      component: () => import('../views/ProposalDetails.vue'),
    },
    {
      path: '/proposals',
      name: 'proposals',
      component: () => import('../views/ProposalListView.vue'),
    },
    {
      path: '/token',
      name: 'token',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TokenView.vue'),
    },
  ],
})

export default router
