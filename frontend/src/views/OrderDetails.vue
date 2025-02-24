<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { useClientStore } from '@/stores/clientStore'
import PaymentInfo from '../components/order/PaymentInfo.vue'
import { formatDate } from '@/utils/formatDate'
import OrderItem from '@/components/order/OrderItem.vue'

const route = useRoute()

const { fetchOrderById } = useOrderStore()
const { currentOrder } = storeToRefs(useOrderStore())
const { getClientById } = useClientStore()

onMounted(() => {
  const orderId = Number(route.params.id)
  fetchOrderById(orderId)
})
</script>

<template>
  <div class="container" v-if="currentOrder">
    <h1>Order #{{ currentOrder.id }}</h1>

    <p><b>client:</b>{{ getClientById(currentOrder.client_id)?.name || currentOrder.client_id }}</p>
    <p><b>status:</b> {{ currentOrder.status }}</p>
    <p><b>created at:</b> {{ formatDate(currentOrder.created_at) }}</p>
    <p><b>payment:</b></p>
    <PaymentInfo v-bind="currentOrder.payment" />
    <p><b>Items:</b></p>
    <OrderItem v-for="item in currentOrder.order_items" v-bind="item" />
    <p><b>total:</b> {{ currentOrder.total }} €</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
