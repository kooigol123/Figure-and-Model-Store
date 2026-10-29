<template>
    <div class="container my-5" v-if="login">
        <!-- header  -->
         <div class="mb-4">
            <p class="text-secondary fw-bold mb-1" style="font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">ORDER HISTORY</p>
            <h2 class="fw-bold mb-2">ประวัติการสั่งซื้อ</h2>
            <p class="text-secondary" style="font-size: 0.95rem;">
                รายการคำสั่งซื้อทั้งหมดของ <span class="text-dark fw-semibold">{{ memName || memEmail }}</span>
            </p>
         </div>

         <!-- สรุปยอด -->
          <div class="row g-4 mb-5">
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px;">
                    <div class="card-body p-4 position-relative overflow-hidden">
                        <h6 class="text-secondary mb-3" style="font-size: 0.9rem;">คำสั่งซื้อทั้งหมด</h6>
                        <h3 class="fw-bold text-dark mb-3">{{ totalOrders }}</h3>
                        <p class="text-muted mb-0" style="font-size: 0.8rem;">รวมคำสั่งซื้อที่รอยืนยัน</p>
                        <div class="position-absolute d-flex align-items-center justify-content-center rounded-3 bg-light" style="top: 24px; right: 24px; width: 42px; height: 42px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#64748b" class="bi bi-clipboard2-check" viewBox="0 0 16 16">
                                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px;">
                    <div class="card-body p-4 position-relative overflow-hidden">
                        <h6 class="text-secondary mb-3" style="font-size: 0.9rem;">สินค้าที่สั่งซื้อแล้ว</h6>
                        <h3 class="fw-bold text-dark mb-3">{{ totalConfirmedItems }} <span class="fs-5 fw-normal text-dark">ชิ้น</span>
                        </h3>
                        <p class="text-muted mb-0" style="font-size: 0.8rem;">เฉพาะคำสั่งซื้อที่ยืนยันแล้ว</p>
                        <div class="position-absolute d-flex align-items-center justify-content-center rounded-3 bg-light" style="top: 24px; right: 24px; width: 42px; height: 42px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#64748b" class="bi bi-box-seam" viewBox="0 0 16 16">
                                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.84l-6.5-2.6v7.922zM2.053 3.963l-1-.4v.5z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-12">
                <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px;">
                    <div class="card-body p-4 position-relative overflow-hidden">
                        <h6 class="text-secondary mb-3" style="font-size: 0.9rem;">ยอดใช้จ่ายรวม</h6>
                        <h3 class="fw-bold text-dark mb-3">{{ totalConfirmedAmount.toLocaleString() }} <span class="fs-5 fw-normal text-dark">บาท</span></h3>
                        <p class="text-muted mb-0" style="font-size: 0.8rem;">เฉพาะคำสั่งซื้อที่ยืนยันแล้ว</p>
                        <div class="position-absolute d-flex align-items-center justify-content-center rounded-3 bg-light" style="top: 24px; right: 24px; width: 42px; height: 42px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#64748b" class="bi bi-wallet2" viewBox="0 0 16 16">
                                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm" style="border-radius: 12px; overflow: hidden;">
            <table class="table mb-0 align-middle table-hover">
                <thead>
                    <tr class="bg-light text-secondary" style="font-size: 0.85rem;">
                        <th class="py-3 px-4 border-bottom-0 fw-semibold" style="width: 20%;">Order ID</th>
                        <th class="py-3 px-4 border-bottom-0 fw-semibold" style="width: 15%;">Order Date</th>
                        <th class="py-3 px-4 border-bottom-0 text-center fw-semibold" style="width: 15%;">Total Items</th>
                        <th class="py-3 px-4 border-bottom-0 text-end fw-semibold" style="width: 20%;">Total Amount</th>
                        <th class="py-3 px-4 border-bottom-0 text-center fw-semibold" style="width: 15%;">Status</th>
                        <th class="py-3 px-4 border-bottom-0 text-center fw-semibold" style="width: 15%;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="cartList.length === 0">
                        <td colspan="6" class="text-center py-5 text-muted">
                            ไม่พบประวัติการสั่งซื้อ
                        </td>
                    </tr>

                    <tr v-for="(order, index) in cartList" :key="order.cartId" class="border-bottom">
                        <td class="py-3 px-4 fw-semibold text-dark">{{ order.cartId }}</td>
                        <td class="py-3 px-4 text-secondary">{{ formattedDate(order.cartDate) }}</td>
                        <td class="py-3 px-4 text-center text-dark">{{ order.sqty || 0 }} ชิ้น</td>
                        <td class="py-3 px-4 text-end fw-bold text-dark">{{ (order.sprice || 0).toLocaleString() }} บาท</td>

                        <td class="py-3 px-4 text-center">
                            <span v-if="order.cartCf" class="badge rounded-pill bg-success bg-opacity-10 border border-success text-success px-3 py-2 fw-normal d-inline-flex align-items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                </svg>
                                ยืนยันแล้ว
                            </span>
                            <span v-else class="badge rounded-pill bg-warning bg-opacity-10 border border-warning text-warning-emphasis px-3 py-2 fw-normal d-inline-flex align-items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                รอยืนยัน
                            </span>
                        </td>

                        <td class="py-3 px-4 text-center">
                            <router-link v-if="order.cartCf" :to="`/orderdetail/${order.cartId}`" class="btn btn-sm btn-outline-primary d-inline-flex align-items-center justify-content-center gap-1 text-nowrap px-3" style="border-radius: 6px; font-size: 0.85rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                                ดูรายการ
                            </router-link>

                            <router-link v-else to="/cart" class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center gap-1 text-nowrap px-3" style="border-radius: 6px; font-size: 0.85rem; color: #475569; border-color: #cbd5e1;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                ไปที่ตะกร้า
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-else class="container my-5 text-center">
        <div class="alert alert-warning shadow-sm border-0 d-inline-block px-5 py-4" style="border-radius: 12px;">
            <h5 class="alert-heading fw-bold mb-2">กรุณาเข้าสู่ระบบ</h5>
            <p class="mb-0">คุณต้องเข้าสู่ระบบก่อนดูประวัติการสั่งซื้อ</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
axios.defaults.withCredentials = true;

const cartList = ref([]);
const memEmail = ref(null);
const memName = ref('');
const login = ref(false);

const formattedDate = (dateStr) => {
    if(!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

onMounted(async () => {
    await getMember();
    if(login.value) {
        await getCartList();
    }
})

const getMember = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/members/detail`);
        login.value = res.data.login;
        memEmail.value = res.data.memEmail;
        memName.value = res.data.memName;
    } catch (err) {
        console.log(err.message);
    }
}

const getCartList = async () => {
    let customer = { id: memEmail.value };
    try {
        const res = await axios.post(`http://localhost:3000/carts/getcartbycus`, customer);
        cartList.value = res.data.sort((a, b) => b.cartId.localeCompare(a.cartId));
    } catch (err) {
        console.error(err);
    }      
}

const totalOrders = computed(() => cartList.value.length);

const totalConfirmedItems = computed(() => {
    return cartList.value
        .filter(order => order.cartCf === true)
        .reduce((sum, order) => sum + (order.sqty || 0), 0);
})

const totalConfirmedAmount = computed(() => {
    return cartList.value
        .filter(order => order.cartCf === true)
        .reduce((sum, order) => sum + (order.sprice || 0), 0);
})
</script>

<style scoped>

.table th {
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.text-warning-emphasis {
  color: #b45309 !important;
}
</style>