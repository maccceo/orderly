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
  <div class="pa-5">
    <form
      @submit.prevent="submitOrder"
      v-bind:model="form"
      class="d-flex flex-column justify-start align-start"
    >
      <div class="flex-row w-100">
        <v-select
          v-model="form.client_id"
          :items="clients"
          item-title="name"
          item-value="id"
          label="Client"
        />
      </div>
      <div class="flex-row w-100">
        <v-select v-model="form.status" :items="ORDER_STATUSES" label="Status" outlined></v-select>
      </div>

      <div
        v-for="(item, index) in form.items"
        :key="index"
        class="flex-row w-100 bg-blue-grey-lighten-5 pa-5 mb-3"
      >
        <v-select
          v-model="item.product_id"
          :items="products"
          item-title="name"
          item-value="id"
          label="Product"
          outlined
          @update:modelValue="updateProduct(item)"
        >
          <template v-slot:selection="{ item }">
            {{ item.title === '0' ? '' : item.title }}
          </template>
        </v-select>

        <template v-if="item.product_id !== 0">
          <v-text-field v-model="item.description" label="Description" readonly></v-text-field>
          <v-text-field
            v-model.number="item.quantity"
            label="Quantity"
            type="number"
            min="1"
            @input="updateSubtotal(item)"
          ></v-text-field>
          <v-text-field
            v-model="item.price"
            :value="`${item.price} €`"
            label="Subtotal"
            readonly
          ></v-text-field>
        </template>
        <div class="flex-row w-100">
          <v-btn color="error" prepend-icon="mdi-delete" @click="removeItem(index)">
            Delete product
          </v-btn>
        </div>
      </div>

      <div class="flex-row w-100">
        <v-btn color="primary" @click="addItem" prepend-icon="mdi-plus"> Add product </v-btn>
      </div>
      <div class="flex-row w-100">
        <v-card-text class="text-h6"> Order total: {{ orderTotal }} € </v-card-text>
      </div>
      <div class="flex-row w-100">
        <v-btn type="submit" color="success" :disabled="!canSubmitOrder" size="large">
          Send order
        </v-btn>
      </div>
    </form>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
  margin-right: 1rem;
}
</style>
