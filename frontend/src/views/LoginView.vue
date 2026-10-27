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

          <button type="submit" class="btn-submit">
            {{ isLogin ? '→ เข้าสู่ระบบ' : '👤+ สมัครสมาชิก' }}
          </button>
        </form>

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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const switchTab = (status) => {
  isLogin.value = status
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = () => {
  if (!isLogin.value) {
    if (form.password.length < 8) {
      alert('⚠️ รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
      return
    }

    const newUserData = {
      name: form.name,
      email: form.email,
      role: 'สมาชิกทั่วไป (Member)',
      avatar: '',
      orderCount: 0
    }
    localStorage.setItem('registeredUser', JSON.stringify(newUserData))

    isLogin.value = true
    form.name = ''
    form.email = ''
    form.password = ''
  } else {
    const savedUser = localStorage.getItem('registeredUser')
    let parsedUser = savedUser ? JSON.parse(savedUser) : null

    const userData = {
      name: parsedUser && parsedUser.email === form.email ? parsedUser.name : 'ผู้ใช้งานระบบ',
      email: form.email,
      role: 'สมาชิกทั่วไป (Member)',
      avatar: parsedUser?.avatar || '',
      orderCount: parsedUser?.orderCount || 0
    }
    
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', 'sample-jwt-token-model-store')

    alert('✨ เข้าสู่ระบบสำเร็จ!')
    router.push('/products')
  }
}

const fillDemo = (type) => {
  if (type === 'member') {
    form.email = 'thara@student.ac.th'
    form.password = '12345678'
  } else {
    form.email = 'admin@modelstore.ac.th'
    form.password = '12345678'
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