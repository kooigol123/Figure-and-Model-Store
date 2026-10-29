<template>
  <div class="auth-page">
    <div class="auth-container">
      
      <div class="auth-left-banner">
        <div class="banner-content">
          <div class="logo-box-glow">🛍️</div>
          <h2>Model Store</h2>
          <p>เข้าสู่ระบบเพื่อสั่งซื้อสินค้า ติดตามประวัติการสั่งซื้อ และจัดการข้อมูลส่วนตัวของคุณ</p>
        </div>
      </div>

      <div class="auth-right-form">
        <div class="form-header">
          <h2>{{ isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก' }}</h2>
          <p>{{ isLogin ? 'Login — ยินดีต้อนรับกลับมา' : 'Register — สร้างบัญชีสมาชิกใหม่' }}</p>
        </div>

        <div class="auth-toggle-tabs">
          <button :class="{ active: isLogin }" @click="switchTab(true)">เข้าสู่ระบบ (Login)</button>
          <button :class="{ active: !isLogin }" @click="switchTab(false)">สมัครสมาชิก (Register)</button>
        </div>

        <form @submit.prevent="handleSubmit" class="form-grid">
          <div v-if="!isLogin" class="form-group">
            <label>ชื่อ-นามสกุล (Name) <span class="req">*</span></label>
            <input v-model="form.name" type="text" placeholder="👤 กรอกชื่อ-นามสกุลของคุณ" required />
          </div>

          <div class="form-group">
            <label>อีเมล (Email) <span class="req">*</span></label>
            <input v-model="form.email" type="email" placeholder="✉️ name@student.ac.th" required />
          </div>

          <div class="form-group">
            <label>รหัสผ่าน (Password) <span class="req">*</span></label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="🔒 ••••••••" 
              :minlength="isLogin ? null : 8" 
              required 
            />
            <small class="input-hint" v-if="!isLogin">อย่างน้อย 8 ตัวอักษร</small>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <template v-if="loading">กำลังดำเนินการ...</template>
            <template v-else>{{ isLogin ? '→ เข้าสู่ระบบ' : '👤+ สมัครสมาชิก' }}</template>
          </button>
        </form>

        <div v-if="message" class="auth-message" :class="messageOk ? 'is-success' : 'is-error'">
          {{ message }}
        </div>

        <div class="demo-account-box" v-if="isLogin">
          <span class="demo-label">บัญชีทดลอง:</span>
          <button @click="fillDemo('member')" class="btn-demo">สมาชิก (Member)</button>
          <button @click="fillDemo('admin')" class="btn-demo">ผู้ดูแลระบบ (Admin)</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_URL = 'http://localhost:3000'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLogin = ref(route.path !== '/register') // เข้าทาง /register = เปิดแท็บสมัครสมาชิก
const loading = ref(false)
const message = ref('')
const messageOk = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

onMounted(async () => {
  // มี cookie ที่ยัง login อยู่ → ไปหน้าสมาชิกเลย
  if (await authStore.fetchMe()) {
    router.push('/pagemember')
  }
})

const switchTab = (status) => {
  isLogin.value = status
  form.name = ''
  form.email = ''
  form.password = ''
  message.value = ''
}

const showMessage = (text, ok) => {
  message.value = text
  messageOk.value = ok
}

const handleSubmit = async () => {
  if (!isLogin.value && form.password.length < 8) {
    showMessage('⚠️ รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร', false)
    return
  }

  loading.value = true
  message.value = ''
  try {
    if (!isLogin.value) {
      // สมัครสมาชิก → สลับไปแท็บ Login พร้อมอีเมลที่สมัคร
      await axios.post(`${API_URL}/auth/register`, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      })
      const email = form.email.trim()
      switchTab(true)
      form.email = email
      showMessage('✨ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', true)
    } else {
      // เข้าสู่ระบบ → backend ตั้ง cookie token ให้ (httpOnly)
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: form.email.trim(),
        password: form.password
      })
      authStore.login(res.data.user)
      router.push('/product')
    }
  } catch (err) {
    showMessage(err.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', false)
  } finally {
    loading.value = false
  }
}

const fillDemo = (type) => {
  if (type === 'member') {
    form.email = 'test@gmail.com'
    form.password = 'test1234'
  } else {
    form.email = 'admin@model.store'
    form.password = 'admin1234'
  }
}
</script>

<style scoped>
.auth-page {
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #0f172a;
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.auth-left-banner {
  width: 42%;
  background: #f1f5f9;
  border-right: 1px solid #e2e8f0;
  padding: 50px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.logo-box-glow {
  font-size: 36px;
  width: 70px;
  height: 70px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.auth-left-banner h2 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
}

.auth-left-banner p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.auth-right-form {
  flex: 1;
  padding: 40px 45px;
}

.form-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.form-header p {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.auth-toggle-tabs {
  display: flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 22px;
}

.auth-toggle-tabs button {
  flex: 1;
  background: transparent;
  border: none;
  color: #64748b;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-toggle-tabs button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.req {
  color: #ef4444;
}

.form-group input {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 13px;
  outline: none;
}

.form-group input:focus {
  border-color: #f97316;
}

.input-hint {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.btn-submit {
  margin-top: 8px;
  padding: 13px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #ea580c;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

.auth-message {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  border: 1px solid;
}

.auth-message.is-success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.auth-message.is-error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
}

.demo-account-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
  font-size: 12px;
}

.demo-label {
  color: #64748b;
}

.btn-demo {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.btn-demo:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }
  .auth-left-banner {
    width: 100%;
    padding: 30px;
  }
}
</style>