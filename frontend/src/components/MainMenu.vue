<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom py-2 shadow-sm sticky-top">
    <div class="container-fluid px-4">
      <!-- LOGO -->
      <a class="navbar-brand d-flex align-items-center gap-2 m-0" href="#">
        <div class="d-flex align-items-center justify-content-center rounded" style="background-color: #f97316; width: 36px; height: 36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-box-seam" viewBox="0 0 16 16">
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.84l-6.5-2.6v7.922zM2.053 3.963l-1-.4v.5z"/>
          </svg>
        </div>
        <span class="fw-bold fs-5 text-dark" style="letter-spacing: -0.5px;">Model Store</span>
      </a>
      <!-- ปุ่มสำหรับมือถือ -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- เมนู -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto d-flex gap-4 align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link custom-nav-link fw-semibold text-decoration-none">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/product" class="nav-link custom-nav-link fw-semibold text-decoration-none">Product</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link custom-nav-link fw-semibold text-decoration-none d-flex align-items-center gap-2">
              Cart
              <span class="badge rounded-pill text-dark" style="background-color: #f1f5f9;">{{ cartCount }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/orderhistory" class="nav-link custom-nav-link fw-semibold text-decoration-none">
              Order History
            </router-link>
          </li>
          <li class="nav-item" v-if="dutyId === 'admin'">
            <router-link to="/backoffice" class="nav-link custom-nav-link fw-semibold text-decoration-none text-orange">
              Backoffice
            </router-link>
          </li>
        </ul>

          <!-- โปรไฟล์ -->
          <ul class="navbar-nav d-flex gap-4 align-items-center">
            <li class="nav-item">
              <router-link to="/pagemember" class="text-decoration-none">
                <div class="profile-badge border rounded-pill p-1 pe-3 d-flex align-items-center gap-2">
                  <template v-if="login">
                    <img :src="authStore.avatarUrl" @error="e => e.target.src = authStore.defaultAvatar" alt="Profile" class="rounded-circle object-fit-cover" width="36" height="36">
                    <div class="d-flex flex-column lh-1 justify-content-center mt-1">
                      <span class="fw-bold text-dark" style="font-size: 0.9rem;">{{ memName }}</span>
                      <span v-if="dutyId === 'admin'" class="text-danger fw-bold" style="font-size: 0.75rem;">
                        Admin
                      </span>
                      <span v-else class="text-secondary" style="font-size: 0.75rem;">
                        Member
                      </span>
                    </div>
                  </template>

                  <template v-else>
                    <div class="d-flex align-items-center justify-content-center rounded-circle" style="width: 36px; height: 36px; background-color: #f1f5f9;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                      </svg>
                    </div>
                    <div class="d-flex flex-column lh-1 justify-content-center mt-1">
                      <span class="fw-bold text-dark" style="font-size: 0.9rem;">ผู้เยี่ยมชม</span>
                      <span class="text-secondary" style="font-size: 0.75rem;">Guest • ยังไม่เข้าสู่ระบบ</span>
                    </div>
                  </template>
                </div>
              </router-link>
            </li>

            <li class="nav-item" v-if="login">
              <a href="#" @click.prevent="memLogout()" class="nav-link text-secondary fw-semibold d-flex align-items-center gap-1 logout-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
                ลงชื่อออก
              </a>
            </li>
            <li class="nav-item" v-if="!login">
              <router-link to="/login" class="btn border fw-semibold d-flex align-items-center gap-2 ms-2 px-3 py-2 text-dark text-decoration-none btn-login" style="border-radius: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
                เข้าสู่ระบบ / สมัครสมาชิก
              </router-link>
            </li>
          </ul>
        
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { onMounted, ref, watch } from "vue";
  import axios from "axios";
  import { useCartStore } from "@/stores/cartStore";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/authStore";
  import CartInfo from './CartInfo.vue';

  const authStore = useAuthStore()
  const router = useRouter()
  const member = ref(null);
  const memEmail = ref(null);
  const memName = ref(null);
  const dutyId = ref(null);
  const login = ref(false)
  const cartStore = useCartStore()
  const cartCount = ref(0)

  // จำนวนชิ้นรวมในตะกร้าที่ยังไม่ยืนยัน (sqty จาก /carts/getcart)
  const getCartCount = async () => {
    if (!authStore.user) {
      cartCount.value = 0
      return
    }
    try {
      const resChk = await axios.post(`http://localhost:3000/carts/chkcart`, { userId: authStore.user.id })
      if (!resChk.data.cartId) {
        cartCount.value = 0
        return
      }
      const resCart = await axios.get(`http://localhost:3000/carts/getcart/${resChk.data.cartId}`)
      cartCount.value = Number(resCart.data.sqty || 0)
    }
    catch (err) {
      console.log(err.message)
    }
  }

  // หน้าอื่นเรียก cartStore.updateQty() ทุกครั้งที่ตะกร้าเปลี่ยน
  watch(() => cartStore.theQty, () => getCartCount())

  // เมื่อ login / logout ที่หน้าอื่น ให้เมนูอัปเดตตาม
  watch(
    () => authStore.user, () =>{
      console.log("Watch")
      setMember()
    }
  )

  onMounted(async () => {
    await authStore.fetchMe();
    setMember();
  });

  const setMember = () => {
    member.value = authStore.user;
    memEmail.value = member.value?.email;
    memName.value = member.value?.name;
    dutyId.value = member.value?.role;
    login.value = authStore.isLogin

    getCartCount()
  }

  const memLogout = async()=>{
    const cf = window.confirm("ต้องการออกจากระบบ?")
    if(cf){
      try{
        await authStore.logout()
        router.push("/")
      }
      catch(err){
        console.log(err)
      }
    }
  }


</script>

<style scoped>

.btn-login {
  border-color: #e2e8f0;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #f97316;
  border-color: #f97316 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}

.btn-login .login-icon {
  transition: transform 0.3s ease;
}

.btn-login:hover .login-icon {
  transform: translateX(4px);
}

.navbar {
  font-family: 'Prompt', 'Noto Sans Thai', sans-serif;
}

.custom-nav-link {
color: #6c757d !important; 
  position: relative;
  padding-bottom: 0.5rem;
  transition: color 0.2s;
  text-decoration: none !important;
}

.profile-badge {
  transition: all 0.2s ease-in-out;
  background-color: white;
}

.custom-nav-link:hover {
  color: #f97316 !important;
}

.router-link-active.custom-nav-link {
  color: #212529 !important; 
}
.router-link-active.custom-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background-color: #f97316;
  border-radius: 2px;
}

.router-link-exact-active.custom-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background-color: #f97316;
  border-radius: 2px;
}

.profile-badge:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.logout-link {
  transition: color 0.2s;
}

.logout-link:hover {
  color: #dc3545 !important;
}

</style>