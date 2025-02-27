<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { useClientStore } from '@/stores/clientStore'
import PaymentInfo from '../components/order/PaymentInfo.vue'
import { formatDate } from '@/utils/formatDate'
import OrderItem from '@/components/order/OrderItem.vue'

const route = useRoute()

const { fetchOrderById, clearCurrentOrder } = useOrderStore()
const { currentOrder } = storeToRefs(useOrderStore())
const { getClientById } = useClientStore()

onMounted(() => {
  const orderId = Number(route.params.id)
  fetchOrderById(orderId)
})
onUnmounted(() => {
  clearCurrentOrder()
})
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title class="d-flex text-h5 py-3 px-5 justify-space-between">
      <div>
        <v-icon large class="mr-2">mdi-shopping</v-icon>
        Order {{ currentOrder?.id ? '#' + currentOrder.id : '' }}
      </div>
      <div>
        <router-link :to="{ name: 'orders' }">
          <v-btn color="primary" prepend-icon="mdi-arrow-left"> Go back </v-btn>
        </router-link>
      </div>
    </v-card-title>
    <div class="pa-5" v-if="currentOrder">
      <p>
        <b>Client:</b> {{ getClientById(currentOrder.client_id)?.name || currentOrder.client_id }}
      </p>
      <p><b>Status:</b> {{ currentOrder.status }}</p>
      <p><b>Created at:</b> {{ formatDate(currentOrder.created_at) }}</p>

      <div class="flex-row my-2">
        <p><b>Payment information:</b></p>
        <PaymentInfo class="ml-2" v-bind="currentOrder.payment" />
      </div>
      <div class="flex-row my-2">
        <p><b>Items:</b></p>
        <OrderItem
          v-for="item in currentOrder.order_items"
          v-bind="item"
          class="mb-2 bg-blue-grey-lighten-5 pa-2"
        />
      </div>

      <p class="text-h5"><b>total:</b> {{ currentOrder.total }} €</p>
    </div>
    <div v-else>
      <h3>No order to show</h3>
    </div>
  </v-card>
</template>

<style scoped></style>
