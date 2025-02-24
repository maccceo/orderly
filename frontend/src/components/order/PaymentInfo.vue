<script setup lang="ts">
import type { PaymentStatus, PaymentMethod } from '@/types/Payment'
import { formatDate } from '@/utils/formatDate'

defineProps<{
  status: PaymentStatus
  method: PaymentMethod
  paid_at: string
}>()
</script>

<template>
  <div class="container">
    <p><b>status:</b> {{ status }}</p>
    <template v-if="status === 'completed'">
      <p><b>method:</b>{{ method }}</p>
      <p><b>paid at:</b> {{ formatDate(paid_at) }}</p>
    </template>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
