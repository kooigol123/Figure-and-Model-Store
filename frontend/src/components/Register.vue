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
                    <h3 class="fw-bold mb-1">สมัครสมาชิก</h3>
                    <p class="text-muted small mb-4">Register — สร้างบัญชีสมาชิกใหม่</p>
                    <div class="d-flex bg-light rounded-3 p-1 mb-4 text-center">
                        <router-link to="/login" class="btn text-muted w-50 rounded-2 text-decoration-none hover-bg">
                        เข้าสู่ระบบ (Login)
                        </router-link>
                        <div class="btn btn-white shadow-sm w-50 rounded-2 fw-semibold" style="cursor: default;">
                        สมัครสมาชิก (Register)
                        </div>
                    </div>

                    <form @submit.prevent="handleSubmit()">
                        <div class="mb-3">
                            <label for="memName" class="form-label small fw-bold">ชื่อ-นามสกุล (Name) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-white text-muted border-end-0">
                                <i class="bi bi-person"></i>
                                </span>
                                <input class="form-control border-start-0 ps-0 custom-input" type="text" id="memName" autocomplete="off" required placeholder="เช่น ณัฐวุฒิ วงศ์ใหญ่" v-model="memName">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="memEmail" class="form-label small fw-bold">อีเมล (Email) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-white text-muted border-end-0">
                                <i class="bi bi-envelope"></i>
                                </span>
                                <input class="form-control border-start-0 ps-0 custom-input" type="email" id="memEmail" autocomplete="off" required placeholder="name@student.ac.th" v-model.trim="memEmail">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password" class="form-label small fw-bold">รหัสผ่าน (Password) <span class="text-danger">*</span></label>
                            <div class="input-group mb-1">
                                <span class="input-group-text bg-white text-muted border-end-0">
                                <i class="bi bi-lock"></i>
                                </span>
                                <input class="form-control border-start-0 ps-0 custom-input" type="password" id="password" autocomplete="off" required placeholder="••••••" v-model="password">
                            </div>
                            <div class="form-text small text-muted" style="font-size: 0.75rem;">อย่างน้อย 6 ตัวอักษร</div>
                        </div>
                        <button class="btn btn-orange w-100 py-2 fw-bold text-white rounded-3 shadow-sm" type="submit">
                            <i class="bi bi-person-plus-fill"></i> สมัครสมาชิก
                        </button>
                    </form>

                    <div v-if="regist && message" class="alert alert-success mt-4 mb-0 py-2 small">
                        <i class="bi bi-check-circle-fill me-1"></i> ลงทะเบียนสำเร็จ - {{ message }}
                    </div>
                    <div v-else-if="!regist && message" class="alert alert-danger mt-4 mb-0 py-2 small">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i> ลงทะเบียนผิดพลาด - {{ message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';

    const memEmail=ref(null)
    const memName=ref(null)
    const password=ref(null)
    const regist=ref(null)
    const message=ref(null)

    const handleSubmit =async()=>{
        let members={
            memEmail:memEmail.value,
            memName:memName.value,
            password:password.value
        }
        try {
            const response = await axios.post(`http://localhost:3000/members`,members)
            console.log(response.data)
            regist.value=response.data.regist
            message.value=response.data.message
        }
        catch(err){
            console.log(err)
            message.value = err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
        }
    }

</script>

<style scoped>

.image-placeholder {
  background-color: #1e293b; 
  background-image: url("/src/assets/LogoSRC.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 550px; 
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