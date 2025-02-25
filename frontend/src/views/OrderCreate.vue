<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import type { Client } from '@/types/Client'
import type { OrderStatus, CreateOrderPayload } from '@/types/Order'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

interface NewOrder {
  client_id: Client | null
  status: OrderStatus | null
  items: NewOrderItems[]
  total: number
}
interface NewOrderItems {
  product_id: number
  quantity: number
  price: number
  description: string
}

const { clients } = storeToRefs(useClientStore())
const { products } = storeToRefs(useProductStore())
const { createOrder } = useOrderStore()

const newOrder = ref<NewOrder>({
  client_id: null,
  status: null,
  items: [],
  total: 0,
})
const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] // todo dinamico

const orderTotal = computed<number>(() => {
  return newOrder.value.items.reduce((sum, item) => sum + item.price, 0)
})

const canSubmitOrder = computed<boolean>(() => {
  return (
    !!newOrder.value.client_id &&
    !!newOrder.value.status &&
    newOrder.value.items.filter((i) => i.product_id && i.product_id > 0).length > 0
  )
})

const submitOrder = async () => {
  if (!canSubmitOrder.value) {
    return
  }
  const validItems = newOrder.value.items
    .filter((i) => i.product_id && i.product_id > 0) // remove empty products
    .map(({ description, ...rest }) => rest) // remove description field

  const payload: CreateOrderPayload = {
    // @ts-expect-error: Typescript can't check the canSubmitOrder computed
    client_id: newOrder.value.client_id,
    // @ts-expect-error: Typescript can't check the canSubmitOrder computed
    status: newOrder.value.status,
    total: parseFloat(orderTotal.value.toFixed(2)),
    order_items: validItems,
  }
  try {
    console.log('new order payload:', payload)

    await createOrder(payload)
  } catch (error) {
    console.error("can't upload order", error)
  }
}

const addItem = () => {
  newOrder.value.items.push({
    product_id: 0,
    quantity: 0,
    price: 0,
    description: '',
  })
}

const removeItem = (index: number) => {
  newOrder.value.items.splice(index, 1)
}

const updateProduct = (index: number) => {
  const item = newOrder.value.items[index]
  const product = products.value.find((p) => p.id === item.product_id)
  if (product) {
    item.description = product.description
    item.quantity = 1
    item.price = product.price * item.quantity
  }
}

const updateSubtotal = (index: number) => {
  const item = newOrder.value.items[index]
  const product = products.value.find((p) => p.id === item.product_id)
  if (product) {
    item.price = product.price * item.quantity
  }
}

onMounted(() => {})
</script>

<template>
  <router-link :to="{ name: 'orders' }"><button>Get back to the orders</button></router-link>
  <div class="container">
    <h1>Create new order</h1>

    <form @submit.prevent="submitOrder">
      <label>Client:</label>
      <select v-model="newOrder.client_id">
        <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </option>
      </select>

      <label>Status:</label>
      <select v-model="newOrder.status">
        <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
          {{ status }}
        </option>
      </select>

      <div v-for="(item, index) in newOrder.items" :key="index">
        <select v-model="item.product_id" @change="updateProduct(index)">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
        <template v-if="item.product_id !== 0">
          <span>{{ item.description }}</span>
          <input
            type="number"
            v-model.number="item.quantity"
            min="1"
            @input="updateSubtotal(index)"
          />
          <span>Subtotal: {{ item.price.toFixed(2) }} €</span>
        </template>
        <button type="button" @click="removeItem(index)">Remove</button>
      </div>
      <button type="button" @click="addItem">Add product</button>

      <p>Order total: {{ orderTotal.toFixed(2) }} €</p>
      <button type="submit" :disabled="!canSubmitOrder">Send order</button>
    </form>
  </div>
</template>

<style scoped></style>
