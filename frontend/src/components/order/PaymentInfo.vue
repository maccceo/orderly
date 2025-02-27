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
  <div class="d-flex flex-column">
    <p><b>Status:</b> {{ status }}</p>
    <template v-if="status === 'completed'">
      <p><b>Payment method:</b>{{ method }}</p>
      <p><b>Paid at:</b> {{ formatDate(paid_at) }}</p>
    </template>
  </div>
</template>

<style scoped></style>
