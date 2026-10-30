import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // ดึง Router เข้ามา

const app = createApp(App)

app.use(createPinia()) // store: authStore (ข้อมูลผู้ใช้จาก cookie) / cartStore
app.use(router) // ติดตั้ง Router เข้าไปในแอป
app.mount('#app')
