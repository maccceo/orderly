<script setup lang="ts">
import OrderForm from '@/components/order/OrderForm.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import type {
  Order,
  OrderForm as OrderFormInterface,
  OrderFormItems,
  UpdateOrderItemsPayload,
  UpdateOrderPayload,
} from '@/types/Order'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { fetchOrderById, updateOrder } = useOrderStore()
const { getProductById } = useProductStore()
const { currentOrder } = storeToRefs(useOrderStore())
const orderForm = ref<OrderFormInterface | null>()

const onSubmit = (form: OrderFormInterface) => {
  if (!currentOrder.value) {
    return
  }
  const orderItems = form.items.map<UpdateOrderItemsPayload>(
    ({ description, ...rest }) => rest as UpdateOrderItemsPayload,
  )
  const payload = {
    id: currentOrder.value.id,
    client_id: form.client_id,
    status: form.status,
    total: form.total,
    order_items: orderItems,
  } as UpdateOrderPayload
  try {
    updateOrder(payload)
  } catch (error) {
    console.error("Can't create order", error)
  }
}

const setOrderForm = (order: Order | null) => {
  if (!order) {
    return {}
  }
  orderForm.value = {
    client_id: order.client_id,
    status: order.status,
    items: order.order_items.map(
      (item): OrderFormItems => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        description: getProductById(item.product_id)?.description || '',
      }),
    ),
    total: Number(order.total),
  }
}

onMounted(async () => {
  const orderId = Number(route.params.id)
  const order = await fetchOrderById(orderId)
  setOrderForm(order)
})
</script>

<template>
  <router-link :to="{ name: 'orders' }"><button>Get back to the orders</button></router-link>
  <div class="container">
    <h1>Edit order</h1>
    <OrderForm v-if="orderForm" :form="orderForm" @submit="onSubmit" />
  </div>
</template>

<style scoped></style>
