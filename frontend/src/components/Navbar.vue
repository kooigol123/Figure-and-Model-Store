<template>
  <nav class="main-navbar">
    <div class="nav-brand" @click="goToHome">
      <div class="logo-box">🛍️</div>
      <span class="logo-text">Model Store</span>
    </div>
    
    <div class="nav-menu-links">
      <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>
      <router-link to="/products" class="nav-link" active-class="active">Products</router-link>
      <router-link to="/cart" class="nav-link" active-class="active">Cart</router-link>
      <router-link to="/orders" class="nav-link" active-class="active">Order History</router-link>
    </div>

    <div class="nav-right">
      <template v-if="isLoggedIn">
        <div class="user-profile-pill" @click="goToProfile">
          <div class="avatar-small">
            <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar" class="mini-avatar-img" />
            <span v-else>👤</span>
          </div>
          <div class="user-text-group">
            <span class="user-name-text">{{ currentUser?.name || currentUser?.username || 'ผู้ใช้งานระบบ' }}</span>
            <span class="user-role-text">Member</span>
          </div>
        </div>

        <button @click="handleLogout" class="logout-btn">
          🚪 ออกจากระบบ
        </button>
      </template>

      <template v-else>
        <div class="guest-profile-pill">
          <div class="avatar-small guest-avatar">👤</div>
          <div class="user-text-group">
            <span class="user-name-text">ผู้เยี่ยมชม</span>
            <span class="user-role-text guest-sub">Guest · ยังไม่เข้าสู่ระบบ</span>
          </div>
        </div>

        <button @click="goToLogin" class="login-redirect-btn">
          →] เข้าสู่ระบบ / สมัครสมาชิก
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const currentUser = ref(null)

const checkUser = () => {
  const userStr = localStorage.getItem('user') || localStorage.getItem('userData')
  const token = localStorage.getItem('token')
  
  if (userStr && token) {
    try {
      currentUser.value = JSON.parse(userStr)
      isLoggedIn.value = true
    } catch (e) {
      currentUser.value = null
      isLoggedIn.value = false
    }
  } else {
    currentUser.value = null
    isLoggedIn.value = false
  }
}

onMounted(checkUser)
watch(() => route.path, checkUser)

const goToHome = () => router.push('/')
const goToProfile = () => router.push('/profile')
const goToLogin = () => router.push('/login')

const handleLogout = () => {
  if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    localStorage.removeItem('user')
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    isLoggedIn.value = false
    currentUser.value = null
    router.push('/login')
  }
}
</script>

<style scoped>
.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: #f97316;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.nav-menu-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 0;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #0f172a;
}

.nav-link.active {
  color: #0f172a;
  font-weight: 700;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #f97316;
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile-pill, .guest-profile-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 4px 14px 4px 6px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-profile-pill:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.avatar-small {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  overflow: hidden;
}

.mini-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-text-group {
  display: flex;
  flex-direction: column;
}

.user-name-text {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.user-role-text {
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
}

.logout-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  transition: color 0.2s;
}

.logout-btn:hover {
  color: #ef4444;
}

.login-redirect-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.login-redirect-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
</style>