<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { storeToRefs } from 'pinia'

const { user, isAuthenticated } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
</script>

<template>
  <v-container>
    <div class="d-flex flex-column align-end mb-3" v-if="isAuthenticated">
      <div class="d-flex align-center">
        <p>Welcome back{{ user?.name ? ', ' + user?.name : '' }}</p>
        <v-btn prepend-icon="mdi-logout" class="float-right ml-3" @click="logout"> Logout </v-btn>
      </div>
    </div>
    <div class="d-flex flex-column">
      <RouterView />
    </div>
  </v-container>
</template>

<style scoped></style>
