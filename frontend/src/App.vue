<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { storeToRefs } from 'pinia'

const { isAuthenticated } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
</script>

<template>
  <v-container>
    <div class="d-flex flex-column align-end mb-3" v-if="isAuthenticated">
      <v-btn prepend-icon="mdi-logout" class="float-right" @click="logout"> Logout </v-btn>
    </div>
    <div class="d-flex flex-column">
      <RouterView />
    </div>
  </v-container>
</template>

<style scoped></style>
