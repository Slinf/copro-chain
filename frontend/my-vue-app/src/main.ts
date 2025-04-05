import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' // Import de Pinia
import { config } from './config'

const app = createApp(App)

const pinia = createPinia()

import { WagmiPlugin } from '@wagmi/vue'

app.use(router)
app.use(pinia)
app.use(WagmiPlugin, { config })
app.mount('#app')
