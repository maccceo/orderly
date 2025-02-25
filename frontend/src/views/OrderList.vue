<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProductStore } from '@/stores/productStore'

import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/formatDate'
import router from '@/router'

const { fetchOrders, deleteOrder } = useOrderStore()
const { orders } = storeToRefs(useOrderStore())
const { getClientById } = useClientStore()

function viewOrder(id: number) {
  router.push({ name: 'order-details', params: { id } })
}

function editOrder(id: number) {
  router.push({ name: 'order-edit', params: { id } })
}

function createOrder() {
  router.push({ name: 'order-new' })
}

async function deleteOrderConfirm(id: number) {
  const confirmed = window.confirm('Are you sure you want to delete the order?')
  if (confirmed) {
    try {
      await deleteOrder(id)
    } catch (error) {
      console.error('Something went wrong:', error)
    }
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="container">
    <h1>Orders</h1>
    <button @click="createOrder()">Create new order</button>
    <table>
      <tr>
        <th>id</th>
        <th>client</th>
        <th>status</th>
        <th>total</th>
        <th>created at</th>
        <th>last update</th>
        <th>payment status</th>
      </tr>
      <tr v-for="order in orders">
        <td>{{ order.id }}</td>
        <td>{{ getClientById(order.client_id)?.name || order.client_id }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.total }} €</td>
        <td>{{ formatDate(order.created_at) }}</td>
        <td>{{ formatDate(order.updated_at) }}</td>
        <td>{{ order.payment.status }}</td>
        <td><button @click="viewOrder(order.id)">Details</button></td>
        <td><button @click="editOrder(order.id)">Edit</button></td>
        <td><button @click="deleteOrderConfirm(order.id)">Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
