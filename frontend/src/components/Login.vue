<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden" style="max-width: 900px; width: 100%;">
      <div class="row g-0">
        <div class="col-md-6 d-none d-md-block position-relative image-placeholder">
          <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 z-1"></div>

          <div class="position-absolute bottom-0 start-0 p-4 p-lg-5 text-white z-2">
            <div class="mb-3">
              <div class="bg-orange d-inline-flex rounded-3 p-2 shadow-sm">
                <i class="bi bi-box-seam text-white fs-4"></i>
              </div>
            </div>
            <h3 class="fw-bold mb-2">Model Store</h3>
            <p class="small mb-0 text-light opacity-75">
              เข้าสู่ระบบเพื่อสั่งซื้อสินค้า ติดตามประวัติการสั่งซื้อ และจัดการข้อมูลส่วนตัวของคุณ
            </p>
          </div>
        </div>

        <div class="col-md-6 p-4 p-md-5 bg-white">
          <h3 class="fw-bold mb-1">เข้าสู่ระบบ</h3>
          <p class="text-muted small mb-4">Login — ยินดีต้อนรับกลับมา</p>
          <div class="d-flex bg-light rounded-3 p-1 mb-4 text-center">
            <div class="btn btn-white shadow-sm w-50 rounded-2 fw-semibold" style="cursor: default;">
              เข้าสู่ระบบ (Login)
            </div>
            <router-link to="/register" class="btn text-muted w-50 rounded-2 text-decoration-none hover-bg">
              สมัครสมาชิก (Register)
            </router-link>
          </div>

          <form @submit.prevent="handleSubmit()">
            <div class="mb-3">
              <label for="loginName" class="form-label small fw-bold">อีเมล (Email) <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text bg-white text-muted border-end-0">
                  <i class="bi bi-envelope"></i>
                </span>
                <input class="form-control border-start-0 ps-0 custom-input" type="email" id="loginName" v-model="loginName" autocomplete="off" required autofocus placeholder="name@gmail.com">
              </div>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label small fw-bold">รหัสผ่าน (Password) <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text bg-white text-muted border-end-0">
                  <i class="bi bi-lock"></i>
                </span>
                <input class="form-control border-start-0 ps-0 custom-input" type="password" id="password" v-model="password" required placeholder="••••••">
              </div>
            </div>

            <button class="btn btn-orange w-100 py-2 fw-bold text-white rounded-3 shadow-sm" type="submit">
              <i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ
            </button>
          </form>

          <div v-if="login && message" class="alert alert-success mt-4 mb-0 py-2 small">
            <i class="bi bi-check-circle-fill me-1"></i> เข้าระบบสำเร็จ - {{ message }}
          </div>
          <div v-else-if="!login && message" class="alert alert-danger mt-4 mb-0 py-2 small">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> เข้าระบบผิดพลาด - {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {onMounted, ref} from 'vue'
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';

  const authStore = useAuthStore()
  const router = useRouter()
  const loginName=ref(null)
  const password=ref(null)
  const login=ref(null)
  const message=ref(null)

  onMounted(async ()=>{
    // ถ้ามี cookie ที่ยัง login อยู่ ให้ไปหน้าสมาชิกเลย
    if (await authStore.fetchMe()) {
      router.push('/pagemember')
    }
  })

  const handleSubmit =async()=>{
    let members = {
      email:loginName.value,
      password:password.value
    }
    try{
      // backend จะตั้ง cookie token ให้เอง
      const response = await axios.post(`http://localhost:3000/auth/login`,members)
      console.log(response.data)
      login.value=true
      message.value=`ยินดีต้อนรับ ${response.data.user.name}`
      authStore.login(response.data.user)
      router.push('/pagemember')
    }
    catch(err){
      console.log(err)
      login.value = false
      message.value = err.response?.data?.message || err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
    }
  }
</script>

<style scoped>
.image-placeholder{
  background-color: #1e293b;
  background-image: url("@/assets/LogoSRC.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 500px;
}

.btn-orange, .bg-orange {
background-color: #f97316;
border-color: #f97316;
}

.btn-orange:hover {
  background-color: #ea580c;
  border-color: #ea580c;
}

.btn-white {
  background-color: white;
}

.hover-bg:hover {
  background-color: #e9ecef;
}

.custom-input:focus {
  border-color: #dee2e6;
  box-shadow: none;
}

.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(249, 115, 22, 0.25);
  border-radius: 0.375rem;
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .custom-input {
  border-color: #f97316;
}
</style>