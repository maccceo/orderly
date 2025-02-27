<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const snackbar = ref({
  show: false,
  content: '',
  color: 'error',
})
const handleLogin = async () => {
  try {
    await login({
      email: email.value,
      password: password.value,
    })
    router.push({ name: 'home' })
  } catch (err) {
    if (err instanceof AxiosError) {
      const message = err.response?.data.message || 'Unable to login'
      snackbar.value = {
        show: true,
        content: message,
        color: 'error',
      }
    }
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center" align="center">
      <div class="flex-row w-50">
        <v-card class="pa-3">
          <v-card-title class="text-h5 text-center">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" class="d-flex flex-column">
              <v-text-field v-model="email" label="Email" type="email" required></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary"> Login </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-row>

    <v-snackbar :timeout="2000" :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.content }}
    </v-snackbar>
  </v-container>
</template>
