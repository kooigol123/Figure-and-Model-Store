<template>
  <div class="container my-5" v-if="login">
    
    <!-- Header -->
    <div class="mb-4">
      <p class="text-secondary fw-bold mb-1" style="font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">MEMBER PROFILE</p>
      <h2 class="fw-bold mb-2">โปรไฟล์สมาชิก</h2>
      <p class="text-secondary" style="font-size: 0.95rem;">
        ดูและแก้ไขข้อมูลส่วนตัวที่ใช้ในการสั่งซื้อสินค้า
      </p>
    </div>

    <div class="row g-4">
      
      <div class="col-lg-4 col-md-5">
        <div class="card border-0 shadow-sm text-center pt-5 pb-4 px-4" style="border-radius: 12px;">
          <div class="position-relative d-inline-block mx-auto mb-3">
            <img :src="authStore.avatarUrl" @error="e => { e.target.onerror = null; e.target.src = authStore.defaultAvatar; }" alt="Profile" class="rounded-circle object-fit-cover shadow-sm" style="width: 140px; height: 140px; border: 4px solid white;">
          </div>
          
          <h4 class="fw-bold text-dark mb-1">{{ memName }}</h4>
          <p class="text-muted mb-3" style="font-size: 0.9rem;">{{ memEmail }}</p>
          
          <div class="d-flex justify-content-center gap-2 mb-4">
            <span v-if="dutyId === 'admin'" class="badge text-danger fw-normal px-3 py-2 d-flex align-items-center gap-1 border border-danger border-opacity-25" style="background-color: #fef2f2; border-radius: 6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-shield-lock" viewBox="0 0 16 16">
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
              </svg>
              Admin
            </span>
            <span v-else class="badge text-secondary fw-normal px-3 py-2 d-flex align-items-center gap-1 border" style="background-color: #f8fafc; border-radius: 6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
              Member
            </span>
            <span class="badge bg-success bg-opacity-10 text-success fw-normal px-3 py-2 d-flex align-items-center gap-1 border border-success border-opacity-25" style="border-radius: 6px;">
              <span class="bg-success rounded-circle d-inline-block" style="width: 6px; height: 6px;"></span> Active
            </span>
          </div>

          <hr class="text-muted opacity-25 mb-4">
          
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-secondary" style="font-size: 0.9rem;">รหัสสมาชิก</span>
            <span class="fw-semibold text-dark">{{ memberId || '-' }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-secondary" style="font-size: 0.9rem;">วันที่สมัคร</span>
            <span class="fw-semibold text-dark">{{ formattedDate(joinDate) }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <span class="text-secondary" style="font-size: 0.9rem;">คำสั่งซื้อทั้งหมด</span>
            <span class="fw-semibold text-dark">{{ totalOrders }} รายการ</span>
          </div>

          <router-link to="/orderhistory" class="btn btn-light w-100 fw-semibold text-primary py-2 d-flex justify-content-center align-items-center gap-2" style="border-radius: 8px; font-size: 0.9rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
            ดูประวัติการสั่งซื้อ
          </router-link>
        </div>
      </div>

      <div class="col-lg-8 col-md-7">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <h5 class="fw-bold mb-1">แก้ไขข้อมูลส่วนตัว (Edit Profile)</h5>
            <p class="text-muted" style="font-size: 0.85rem;">ข้อมูลนี้จะแสดงในคำสั่งซื้อและในระบบจัดการหลังร้าน</p>
          </div>
          
          <div class="card-body px-4 py-3">
            <label class="form-label text-secondary fw-semibold mb-2" style="font-size: 0.85rem;">รูปโปรไฟล์ (Profile Picture)</label>
            <div class="bg-light rounded-3 p-3 mb-2 border">
              <div class="d-flex align-items-center gap-4">
                <img v-if="previewUrl" :src="previewUrl" alt="New Profile" class="rounded-circle object-fit-cover shadow-sm" style="width: 70px; height: 70px;">
                <img v-else :src="authStore.avatarUrl" @error="e => { e.target.onerror = null; e.target.src = authStore.defaultAvatar; }" alt="Current Profile" class="rounded-circle object-fit-cover shadow-sm" style="width: 70px; height: 70px;">

                <div class="flex-grow-1">
                  <p class="mb-2 fw-semibold" style="font-size: 0.9rem;">{{ previewUrl ? 'รูปใหม่ (กดบันทึกเพื่อใช้รูปนี้)' : 'รูปปัจจุบัน' }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <label for="fileUpload" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 px-3 bg-white" style="cursor: pointer; border-radius: 6px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                      </svg>
                      เลือกไฟล์
                    </label>
                    <input type="file" id="fileUpload" ref="fileInput" class="d-none" @change="onFileChange" accept="image/jpeg, image/png">
                    <span class="text-muted" style="font-size: 0.8rem;" v-if="!file">ยังไม่ได้เลือกไฟล์</span>
                    <span class="text-dark fw-semibold" style="font-size: 0.8rem;" v-else>{{ file.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p class="text-muted mb-4" style="font-size: 0.75rem;">รองรับไฟล์ JPG หรือ PNG ขนาดไม่เกิน 2MB รูปสี่เหลี่ยมจัตุรัสจะแสดงผลได้ดีที่สุด</p>

            <div v-if="saveMessage" :class="['alert', saveOK ? 'alert-success' : 'alert-danger', 'py-2', 'small']">
              {{ saveMessage }}
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-secondary fw-semibold mb-1" style="font-size: 0.85rem;">ชื่อ (Name) <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0 text-dark" v-model="editName" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-semibold mb-1" style="font-size: 0.85rem;">อีเมล (Email) <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control border-start-0 ps-0 text-dark" v-model="memEmail" readonly>
                </div>
              </div>
            </div>

            <hr class="text-muted opacity-25 my-4">

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-light text-secondary border px-4" style="border-radius: 8px;" @click="resetForm" :disabled="saving || !isDirty">
                <i class="bi bi-arrow-counterclockwise me-1"></i> ยกเลิกการแก้ไข
              </button>
              <button type="button" class="btn btn-orange px-4 text-white fw-semibold shadow-sm" style="border-radius: 8px;" @click="saveProfile" :disabled="saving || !isDirty">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i> บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/authStore';

    const authStore = useAuthStore()

    const member=ref(null)
    const memEmail=ref(null)
    const memName=ref(null)
    const dutyId=ref(null)
    const login=ref(false)
    const file=ref(null)
    const fileInput=ref(null)
    const previewUrl=ref(null)
    const editName=ref('')
    const saving=ref(false)
    const saveMessage=ref(null)
    const saveOK=ref(false)

    // มีอะไรเปลี่ยนจากข้อมูลเดิมไหม (ใช้เปิด/ปิดปุ่มบันทึก)
    const isDirty = computed(() => !!file.value || editName.value.trim() !== (memName.value || ''))

    const memberId = ref(null);
    const joinDate = ref(null);
    const totalOrders = ref(0);

    const formattedDate = (dateStr) => {
    if(!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    }

    onMounted(async()=>{
        await getMember()
        if(login.value){
            await getOrderCount()
        }
    })

    const getMember=async()=>{
        member.value = await authStore.fetchMe()
        login.value = !!member.value
        if(login.value){
            memEmail.value=member.value.email
            memName.value=member.value.name
            editName.value=member.value.name
            dutyId.value=member.value.role
            memberId.value=member.value.id
            joinDate.value=member.value.created_at
        }
    }

    const getOrderCount = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/auth/carts/history/${memberId.value}`);
            totalOrders.value = res.data.length;
        } 
        catch (err) {
            console.error(err);
        }
    }

    // เลือกไฟล์แล้วแสดงตัวอย่างก่อน ยังไม่อัปโหลดจนกว่าจะกดบันทึก
    const onFileChange=(e)=>{
        const f = e.target.files[0]
        saveMessage.value = null
        if(!f) return
        if(!['image/jpeg', 'image/png'].includes(f.type) || f.size > 2 * 1024 * 1024){
            saveOK.value = false
            saveMessage.value = "รองรับเฉพาะไฟล์ JPG หรือ PNG ขนาดไม่เกิน 2MB"
            e.target.value = ''
            return
        }
        if(previewUrl.value) URL.revokeObjectURL(previewUrl.value)
        file.value = f
        previewUrl.value = URL.createObjectURL(f)
    }

    const clearFile=()=>{
        if(previewUrl.value) URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
        file.value = null
        if(fileInput.value) fileInput.value.value = ''
    }

    const resetForm=()=>{
        clearFile()
        editName.value = memName.value
        saveMessage.value = null
    }

    const saveProfile=async()=>{
        const name = editName.value.trim()
        if(!name){
            saveOK.value = false
            saveMessage.value = "กรุณากรอกชื่อ"
            return
        }
        saving.value = true
        saveMessage.value = null
        try{
            if(file.value){
                const formData = new FormData()
                formData.append("file", file.value)
                await axios.post(`http://localhost:3000/auth/me/avatar`, formData)
                authStore.refreshAvatar() // navbar และหน้านี้โหลดรูปใหม่ทันที
                clearFile()
            }
            if(name !== memName.value){
                const res = await axios.put(`http://localhost:3000/auth/me`, { name })
                authStore.login(res.data) // อัปเดต user ใน store → navbar เปลี่ยนชื่อทันที
                memName.value = res.data.name
                editName.value = res.data.name
            }
            saveOK.value = true
            saveMessage.value = "บันทึกข้อมูลสำเร็จ"
        }
        catch(err){
            saveOK.value = false
            saveMessage.value = err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ"
        }
        finally{
            saving.value = false
        }
    }

</script>

<style scoped>
.btn-orange {
  background-color: #f97316;
  border-color: #f97316;
}
.btn-orange:hover {
  background-color: #ea580c;
  border-color: #ea580c;
}
.form-control:read-only {
  background-color: #f8fafc;
}
.btn-outline-secondary {
  border-color: #e2e8f0;
  color: #475569;
}
.btn-outline-secondary:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}
</style>