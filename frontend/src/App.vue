<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useClientStore } from '@/stores/clientStore'
import { useProductStore } from '@/stores/productStore'

const { fetchClients } = useClientStore()
const { fetchProducts } = useProductStore()

onMounted(() => {
  fetchClients()
  fetchProducts()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
