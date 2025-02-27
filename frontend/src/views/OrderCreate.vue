<script setup lang="ts">
import OrderForm from '@/components/order/OrderForm.vue'
import router from '@/router'
import { useOrderStore } from '@/stores/orderStore'
import type {
  CreateOrderItemsPayload,
  CreateOrderPayload,
  OrderForm as OrderFormInterface,
} from '@/types/Order'
import { ref } from 'vue'

const { createOrder } = useOrderStore()
const snackbar = ref({
  show: false,
  content: '',
  color: 'success',
})

const onSubmit = async (form: OrderFormInterface) => {
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
    await createOrder(payload)
    snackbar.value = {
      show: true,
      content: 'Order succesfully created! Redirect in 3 seconds...',
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
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title class="d-flex text-h5 py-3 px-5 justify-space-between">
      <div>
        <v-icon large class="mr-2">mdi-shopping</v-icon>
        Create new order
      </div>
      <div>
        <router-link :to="{ name: 'orders' }">
          <v-btn color="primary" prepend-icon="mdi-arrow-left"> Go back </v-btn>
        </router-link>
      </div>
    </v-card-title>

    <OrderForm @submit="onSubmit" />
  </v-card>

  <v-snackbar :timeout="2000" :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.content }}
  </v-snackbar>
</template>

<style scoped></style>
