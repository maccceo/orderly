<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProductStore } from '@/stores/productStore'

import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/formatDate'
import router from '@/router'
import type { OrderStatus } from '@/types/Order'
import type { PaymentStatus } from '@/types/Payment'

const { fetchOrders, deleteOrder } = useOrderStore()
const { orders } = storeToRefs(useOrderStore())
const { getClientById } = useClientStore()

const headers = ref([
  {
    title: 'ID',
    value: 'id',
    width: '60px',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Client',
    value: 'client_id',
    sortable: false,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Status',
    value: 'status',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Total',
    value: 'total',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Created at',
    value: 'created_at',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Last update',
    value: 'updated_at',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Payment',
    value: 'payment.status',
    sortable: true,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
  {
    title: 'Actions',
    value: 'actions',
    width: '150px',
    sortable: false,
    headerProps: { class: 'order-table-cell' },
    cellProps: { class: 'order-table-cell' },
  },
])

const isLoading = ref(false)
const sortBy = ref<[{ key: string; order: 'asc' | 'desc' }]>([{ key: 'id', order: 'asc' }])

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

function getPaymentStatusColor(status: PaymentStatus) {
  const colors = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
  }
  return colors[status] || 'warning'
}
function getOrderStatusColor(status: OrderStatus) {
  const colors = {
    paid: 'success',
    shipped: 'success',
    delivered: 'success',
    pending: 'warning',
    cancelled: 'error',
  }
  return colors[status] || 'warning'
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <v-card class="container mb-6">
    <h1 class="text-h2 text-center pa-6">Orderly</h1>

    <v-card-title class="d-flex text-h5 py-3 px-5 justify-space-between">
      <div>
        <v-icon large class="mr-2">mdi-shopping</v-icon>
        Orders
      </div>
      <div>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="createOrder" class="mr-2">
          New order
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-sync" @click="fetchOrders"> Update </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="my-3">
      <v-data-table
        :headers="headers"
        :sort-by="sortBy"
        :items="orders"
        item-key="id"
        :items-per-page="10"
        class="order-table elevation-1"
        :loading="isLoading"
        loading-text="Loading..."
      >
        <!-- total -->
        <template v-slot:item.total="{ item }"> {{ item.total }} € </template>
        <!-- created at -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <!-- update at -->
        <template v-slot:item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <!-- client -->
        <template v-slot:item.client_id="{ item }">
          {{ getClientById(item.client_id)?.name || item.client_id }}
        </template>
        <!-- payment -->
        <template v-slot:item.payment.status="{ item }">
          <v-chip :color="getPaymentStatusColor(item.payment.status)" text-color="white" small>
            {{ item.payment.status }}
          </v-chip>
        </template>
        <!-- status -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="getOrderStatusColor(item.status)" text-color="white" small>
            {{ item.status }}
          </v-chip>
        </template>
        <!-- open - edit - delete actions -->
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="x-small" color="info" class="mr-1" @click="viewOrder(item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn icon size="x-small" color="warning" class="mr-1" @click="editOrder(item.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="x-small" color="error" @click="deleteOrderConfirm(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
:deep(.order-table-cell) {
  padding: 10px 0 !important;
}
</style>
