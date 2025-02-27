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
  <div class="d-flex flex-column">
    <p><b>Product: </b>{{ product.name }}</p>
    <p v-if="product.description"><b>description: </b>{{ product.description }}</p>

    <p class="mt-2"><b>Total: </b>{{ product.price }} € X {{ quantity }} = {{ total }} €</p>
  </div>
</template>

<style scoped></style>
