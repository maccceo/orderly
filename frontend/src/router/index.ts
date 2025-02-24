import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { path: '/orders' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderList.vue'),
      meta: {
        title: 'Order list',
      },
    },
    {
      path: '/orders/:id',
      name: 'order-details',
      component: () => import('../views/OrderDetails.vue'),
      meta: {
        title: 'Order detail',
      },
    },
    {
      path: '/orders/:id/edit',
      name: 'order-edit',
      component: () => import('../views/OrderForm.vue'),
      meta: {
        title: 'Edit order',
      },
    },
    {
      path: '/orders/new',
      name: 'order-new',
      component: () => import('../views/OrderForm.vue'),
      meta: {
        title: 'Create new order',
      },
    },
  ],
})

export default router
