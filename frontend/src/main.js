import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ดึง Router เข้ามา
import './style.css'

const app = createApp(App)

app.use(router) // ติดตั้ง Router เข้าไปในแอป
app.mount('#app')