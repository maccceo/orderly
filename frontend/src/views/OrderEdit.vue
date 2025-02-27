<script setup lang="ts">
import OrderForm from '@/components/order/OrderForm.vue'
import router from '@/router'
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

const snackbar = ref({
  show: false,
  content: '',
  color: 'success',
})

const onSubmit = async (form: OrderFormInterface) => {
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
    await updateOrder(payload)
    snackbar.value = {
      show: true,
      content: 'Order succesfully updated! Redirect in 3 seconds...',
      color: 'success',
    }
    setTimeout(() => {
      router.push({ name: 'orders' })
    }, 3000)
  } catch (error) {
    console.error("Can't create order", error)
    snackbar.value = {
      show: true,
      content: 'Something went wrong',
      color: 'error',
    }
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
  <v-card class="d-flex flex-column">
    <v-card-title class="d-flex text-h5 py-3 px-5 justify-space-between">
      <div>
        <v-icon large class="mr-2">mdi-shopping</v-icon>
        Edit order {{ currentOrder?.id ? '#' + currentOrder.id : '' }}
      </div>
      <div>
        <router-link :to="{ name: 'orders' }">
          <v-btn color="primary" prepend-icon="mdi-arrow-left"> Go back </v-btn>
        </router-link>
      </div>
    </v-card-title>

    <OrderForm v-if="orderForm" :form="orderForm" @submit="onSubmit" />
  </v-card>

  <v-snackbar :timeout="2000" :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.content }}
  </v-snackbar>
</template>

<style scoped></style>
