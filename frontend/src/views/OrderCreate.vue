<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { useProductStore } from '@/stores/productStore'
import type { Client } from '@/types/Client'
import type { OrderStatus } from '@/types/Order'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

interface NewOrder {
  client: Client | null
  status: OrderStatus | null
  items: NewOrderItems[]
}
interface NewOrderItems {
  product_id: number
  quantity: number
  price: number
  description: string
}

const { clients } = storeToRefs(useClientStore())
const { products } = storeToRefs(useProductStore())

const newOrder = ref<NewOrder>({
  client: null,
  status: null,
  items: [],
})
const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] // todo dinamico

const submitOrder = () => {
  console.log(newOrder.value)
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

const orderTotal = computed(() => {
  return newOrder.value.items.reduce((sum, item) => sum + item.price, 0)
})

onMounted(() => {})
</script>

<template>
  <router-link :to="{ name: 'orders' }"><button>Get back to the orders</button></router-link>
  <div class="container">
    <h1>Create new order</h1>

    <form @submit.prevent="submitOrder">
      <label>Client:</label>
      <select v-model="newOrder.client">
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
      <button
        type="submit"
        :disabled="!newOrder.client || !newOrder.status || newOrder.items.length === 0"
      >
        Send order
      </button>
    </form>
  </div>
</template>

<style scoped></style>
