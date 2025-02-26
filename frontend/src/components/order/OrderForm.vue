<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { useProductStore } from '@/stores/productStore'
import type { OrderForm, OrderFormItems } from '@/types/Order'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { clients } = storeToRefs(useClientStore())
const { products } = storeToRefs(useProductStore())
const { getProductById } = useProductStore()

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

interface OrderFormEmits {
  (e: 'submit', orderForm: OrderForm): void
}
const emits = defineEmits<OrderFormEmits>()
const props = defineProps<{ form?: OrderForm }>()
const form = ref<OrderForm>({
  client_id: props.form?.client_id || null,
  status: props.form?.status || null,
  items: props.form?.items || [],
  total: props.form?.total || 0,
})

const orderTotal = computed<number>(() => {
  return Math.round(form.value.items.reduce((sum, item) => sum + item.price, 0) * 100) / 100
})

const canSubmitOrder = computed<boolean>(() => {
  return (
    !!form.value.client_id &&
    !!form.value.status &&
    form.value.items.filter((i) => i.product_id && i.product_id > 0).length > 0
  )
})

const submitOrder = () => {
  if (!canSubmitOrder.value) {
    return
  }
  const validItems = form.value.items.filter((i) => i.product_id && i.product_id > 0) // remove empty products

  const orderForm: OrderForm = {
    client_id: form.value.client_id,
    status: form.value.status,
    total: parseFloat(orderTotal.value.toFixed(2)),
    items: validItems,
  }
  emits('submit', orderForm)
}

const addItem = () => {
  form.value.items.push({
    product_id: 0,
    quantity: 0,
    price: 0,
    description: '',
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const updateProduct = (item: OrderFormItems) => {
  const product = getProductById(item.product_id)
  if (product) {
    item.description = product.description
    item.quantity = 1
    item.price = Math.round(product.price * item.quantity * 100) / 100
  }
}

const updateSubtotal = (item: OrderFormItems) => {
  const product = getProductById(item.product_id)
  if (product) {
    item.price = Math.round(product.price * item.quantity * 100) / 100
  }
}
</script>

<template>
  <form @submit.prevent="submitOrder" v-bind:model="form">
    <label>Client:</label>
    <select v-model="form.client_id">
      <option v-for="client in clients" :key="client.id" :value="client.id">
        {{ client.name }}
      </option>
    </select>

    <label>Status:</label>
    <select v-model="form.status">
      <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
        {{ status }}
      </option>
    </select>

    <div v-for="(item, index) in form.items" :key="index">
      <select v-model="item.product_id" @change="updateProduct(item)">
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>
      <template v-if="item.product_id !== 0">
        <span>{{ item.description }}</span>
        <input type="number" v-model.number="item.quantity" min="1" @input="updateSubtotal(item)" />
        <span>Subtotal: {{ item.price }} €</span>
      </template>
      <button type="button" @click="removeItem(index)">Remove</button>
    </div>
    <button type="button" @click="addItem">Add product</button>

    <p>Order total: {{ orderTotal }} €</p>
    <button type="submit" :disabled="!canSubmitOrder">Send order</button>
  </form>
</template>

<style scoped></style>
