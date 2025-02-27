import { createRouter, createWebHistory } from 'vue-router'

const isAuthenticated = () => !!localStorage.getItem('token')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/',
      name: 'home',
      redirect: { path: '/orders' },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderList.vue'),
      meta: {
        title: 'Order list',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id',
      name: 'order-details',
      component: () => import('../views/OrderDetails.vue'),
      meta: {
        title: 'Order detail',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id/edit',
      name: 'order-edit',
      component: () => import('../views/OrderEdit.vue'),
      meta: {
        title: 'Edit order',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/new',
      name: 'order-new',
      component: () => import('../views/OrderCreate.vue'),
      meta: {
        title: 'Create new order',
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  // intercept unauthenticated users and move them to the login route
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated()) {
    next({ name: 'login' })
  }
  // intercept authenticated users in guest only routes and move them to home route
  else if (to.matched.some((record) => record.meta.guest) && isAuthenticated()) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
