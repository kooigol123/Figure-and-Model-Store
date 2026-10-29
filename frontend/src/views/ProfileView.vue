<template>
  <div class="profile-page">
    <div class="profile-container">
      
      <div class="profile-header-title">
        <p class="sub-label">MEMBER PROFILE</p>
        <h2>โปรไฟล์สมาชิก</h2>
        <p class="desc-label">ดูและแก้ไขข้อมูลส่วนตัวที่ใช้ในการสั่งซื้อสินค้าและจัดการระบบหลังร้าน</p>
      </div>

      <div class="profile-grid-layout">
        
        <div class="profile-left-card">
          <div class="avatar-container">
            <img 
              :src="user.avatar || defaultAvatar" 
              alt="Profile Avatar" 
              class="avatar-img"
            />
          </div>
          
          <h3 class="user-fullname">{{ user.name || 'ผู้ใช้งานระบบ' }}</h3>
          <p class="user-email-text">{{ user.email || 'user@student.ac.th' }}</p>

          <div class="badge-group">
            <span class="status-badge member">👤 Member</span>
            <span class="status-badge active">● Active</span>
          </div>

          <div class="member-info-list">
            <div class="info-row">
              <span class="info-title">รหัสสมาชิก</span>
              <span class="info-value">M008</span>
            </div>
            <div class="info-row">
              <span class="info-title">วันที่สมัคร</span>
              <span class="info-value">2026-10-27</span>
            </div>
            <div class="info-row">
              <span class="info-title">คำสั่งซื้อทั้งหมด</span>
              <span class="info-value highlight">{{ orderCount }} รายการ</span>
            </div>
          </div>

          <button class="btn-history" @click="goToOrders">
            🕒 ดูประวัติการสั่งซื้อ
          </button>
        </div>

        <div class="profile-right-card">
          <div class="edit-header">
            <h3>แก้ไขข้อมูลส่วนตัว (Edit Profile)</h3>
            <p>ข้อมูลนี้จะแสดงในคำสั่งซื้อและในระบบจัดการหลังร้าน</p>
          </div>

          <form @submit.prevent="updateProfile" class="edit-form">
            
            <div class="form-group">
              <label>รูปโปรไฟล์ (Profile Picture)</label>
              <div class="upload-box-wrapper">
                <div class="current-mini-avatar">
                  <img :src="user.avatar || defaultAvatar" alt="Preview" />
                </div>
                <div class="upload-action-side">
                  <span class="upload-title-text">รูปปัจจุบัน</span>
                  <label class="btn-upload-file">
                    📁 เลือกไฟล์
                    <input type="file" @change="handleImageUpload" accept="image/*" hidden />
                  </label>
                  <span class="upload-hint">รองรับไฟล์ JPG หรือ PNG</span>
                </div>
              </div>
            </div>

            <div class="form-row-grid">
              <div class="form-group">
                <label>ชื่อ (Name) <span class="req">*</span></label>
                <input v-model="user.name" type="text" required placeholder="กรอกชื่อของคุณ" />
              </div>

              <div class="form-group">
                <label>อีเมล (Email) <span class="req">*</span></label>
                <input v-model="user.email" type="email" disabled class="input-disabled" />
              </div>
            </div>

            <div class="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input v-model="user.phone" type="text" placeholder="089-123-4567" />
            </div>

            <div class="form-group">
              <label>ที่อยู่จัดส่งสินค้า</label>
              <textarea v-model="user.address" rows="3" placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="resetForm">ยกเลิกการแก้ไข</button>
              <button type="submit" class="btn-save-pro">💾 บันทึกข้อมูล</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const defaultAvatar = 'https://via.placeholder.com/150/e2e8f0/64748b?text=User'
const orderCount = ref(0)

const user = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: ''
})

onMounted(() => {
  const localUser = localStorage.getItem('user') || localStorage.getItem('userData')
  if (localUser) {
    try {
      const parsed = JSON.parse(localUser)
      user.name = parsed.name || parsed.username || ''
      user.email = parsed.email || ''
      user.phone = parsed.phone || ''
      user.address = parsed.address || ''
      user.avatar = parsed.avatar || ''
    } catch (e) {
      console.error(e)
    }
  }

  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) {
    try {
      const ordersArr = JSON.parse(savedOrders)
      orderCount.value = Array.isArray(ordersArr) ? ordersArr.length : 0
    } catch (e) {
      orderCount.value = 0
    }
  } else {
    orderCount.value = 0
  }
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      user.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const updateProfile = () => {
  localStorage.setItem('user', JSON.stringify(user))
  alert('✨ บันทึกข้อมูลส่วนตัวสำเร็จเรียบร้อยแล้ว!')
}

const resetForm = () => {
  const localUser = localStorage.getItem('user') || localStorage.getItem('userData')
  if (localUser) {
    const parsed = JSON.parse(localUser)
    user.name = parsed.name || ''
    user.phone = parsed.phone || ''
    user.address = parsed.address || ''
    user.avatar = parsed.avatar || ''
  }
}

const goToOrders = () => {
  router.push('/orders')
}
</script>

<style scoped>
.profile-page {
  background: #f8fafc;
  min-height: calc(100vh - 65px);
  padding: 40px 20px;
  color: #0f172a;
}

.profile-container {
  max-width: 1100px;
  margin: 0 auto;
}

.profile-header-title {
  margin-bottom: 30px;
}

.sub-label {
  font-size: 11px;
  font-weight: 700;
  color: #f97316;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.profile-header-title h2 {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.desc-label {
  font-size: 13px;
  color: #64748b;
}

.profile-grid-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.profile-left-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  height: fit-content;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f97316;
  margin-bottom: 16px;
  background: #f1f5f9;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-fullname {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.user-email-text {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 14px;
}

.badge-group {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.status-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.member {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.status-badge.active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.member-info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 0;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.info-title {
  color: #64748b;
}

.info-value {
  color: #0f172a;
  font-weight: 600;
}

.info-value.highlight {
  color: #f97316;
}

.btn-history {
  width: 100%;
  background: #ffffff;
  border: 1px solid #f97316;
  color: #f97316;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-history:hover {
  background: #fff7ed;
}

.profile-right-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.edit-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.edit-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.edit-header p {
  font-size: 12px;
  color: #64748b;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.upload-box-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 14px;
  border-radius: 14px;
}

.current-mini-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f97316;
  background: #ffffff;
}

.current-mini-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-action-side {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-title-text {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.btn-upload-file {
  display: inline-block;
  background: #ffffff;
  color: #0f172a;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  width: fit-content;
}

.btn-upload-file:hover {
  background: #f1f5f9;
}

.upload-hint {
  font-size: 11px;
  color: #94a3b8;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.req {
  color: #ef4444;
}

.form-group input, .form-group textarea {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: #f97316;
}

.input-disabled {
  background: #f1f5f9 !important;
  color: #94a3b8 !important;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-save-pro {
  background: #f97316;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-save-pro:hover {
  background: #ea580c;
}

@media (max-width: 768px) {
  .profile-grid-layout {
    grid-template-columns: 1fr;
  }
  .form-row-grid {
    grid-template-columns: 1fr;
  }
}
</style>