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
  <div id="app-container">
    <RouterView />
  </div>
</template>

<style scoped>
#app-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>
