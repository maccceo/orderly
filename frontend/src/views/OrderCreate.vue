<script setup lang="ts">
import OrderForm from '@/components/order/OrderForm.vue'
import { useOrderStore } from '@/stores/orderStore'
import type {
  CreateOrderItemsPayload,
  CreateOrderPayload,
  OrderForm as OrderFormInterface,
} from '@/types/Order'
import { onMounted } from 'vue'

const { createOrder } = useOrderStore()

const onSubmit = (form: OrderFormInterface) => {
  const orderItems = form.items.map<CreateOrderItemsPayload>(
    ({ description, ...rest }) => rest as CreateOrderItemsPayload,
  )
  const payload = {
    client_id: form.client_id,
    status: form.status,
    total: form.total,
    order_items: orderItems,
  } as CreateOrderPayload
  try {
    createOrder(payload)
  } catch (error) {
    console.error("Can't create order", error)
  }
}

onMounted(() => {})
</script>

<template>
  <router-link :to="{ name: 'orders' }"><button>Get back to the orders</button></router-link>
  <div class="container">
    <h1>Create new order</h1>
    <OrderForm @submit="onSubmit" />
  </div>
</template>

<style scoped></style>
