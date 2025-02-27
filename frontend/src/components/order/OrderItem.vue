<script setup lang="ts">
import { useProductStore } from '@/stores/productStore'
import type { OrderItems } from '@/types/OrderItems'
import type { Product } from '@/types/Product'
import { computed } from 'vue'

const { getProductById } = useProductStore()

const { product_id, quantity, price: total } = defineProps<OrderItems>()
const product = computed(() => getProductById(product_id) as Product)
</script>

<template>
  <hr />
  <p><b>Product: </b>{{ product.name }}</p>
  <p v-if="product.description"><b>description: </b>{{ product.description }}</p>
  <p><b>Price: </b>{{ product.price }} € X {{ quantity }}</p>
  <p><b>total: </b>{{ total }} €</p>
  <hr />
</template>

<style scoped></style>
