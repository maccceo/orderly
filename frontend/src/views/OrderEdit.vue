<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { useOrderStore } from '@/stores/orderStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

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
  <router-link :to="{ name: 'orders' }"><button>Get back to the orders</button></router-link>
  <div class="container" v-if="currentOrder">
    <h1>Edit order #{{ currentOrder.id }}</h1>
    <pre>{{ currentOrder }}</pre>
  </div>
</template>

<style scoped></style>
