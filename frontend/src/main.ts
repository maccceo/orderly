import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(
  createVuetify({
    components,
    directives,
  }),
)
app.use(router)

app.mount('#app')
