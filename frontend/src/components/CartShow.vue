<template>
    <div class="container my-5" v-if="memEmail == cusId">
        <!-- header -->
        <div class="mb-4">
            <p class="text-secondary fw-bold mb-1" style="font-size: 0.85rem; letter-spacing: 1px;">SHOPPING CART</p>
            <h2 class="fw-bold mb-2">ตะกร้าสินค้า</h2>
            <div class="d-flex justify-content-between align-items-center">
                <p class="text-secondary mb-0" style="font-size: 0.95rem;">
                    ตรวจสอบรายการสินค้าก่อนยืนยันการสั่งซื้อ
                </p>

                <button class="btn btn-outline-danger fw-semibold px-3 py-2 d-flex align-items-center gap-2" style="border-radius: 8px; font-size: 0.9rem;" @click="confirmDeleteCart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.813 1H3.187l-.84 10.493a1 1 0 0 0 .997.92h6.23a1 1 0 0 0 .997-.92l-.84-10.493ZM7 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7ZM4.5 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7ZM9.5 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7Z"/>
                    </svg>
                    ลบตะกร้าสินค้า
                </button>
            </div>
        </div>
        <!-- Master -->
        <div v-for="(ct, cartId) in cart" :key="cartId" class="card shadow-sm border-0 mb-4" style="border-radius: 12px; background-color: #f8fafc;">
            <div class="card-body px-4 py-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-4">
                    <div>
                        <span class="text-secondary" style="font-size: 0.9rem;">คำสั่งซื้อเลขที่: </span>
                        <span class="fw-bold fs-5 ms-1">{{ ct.cartId }}</span>
                    </div>
                    <div style="width: 1px; height: 24px; background-color: #cbd5e1;"></div>
                    <div>
                        <span class="text-secondary" style="font-size: 0.9rem;">สั่งซื้อวันที่: </span>
                        <span class="fw-bold fs-5 ms-1">{{ formattedDate(ct.cartDate) }}</span>
                    </div>
                </div>

                <div class="badge rounded-pill bg-warning text-dark bg-opacity-10 border border-warning px-3 py-2 fw-normal d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    ยังไม่ยืนยันการสั่งซื้อ
                </div>
            </div>
        </div>
   
        <div class="card shadow-sm border-0 mb-4" style="border-radius: 12px; overflow: hidden;">
            <table class="table mb-0 align-middle">
                <thead>
                    <tr class="bg-light text-secondary" style="font-size: 0.85rem;">
                        <th class="py-3 px-4 border-bottom-0 fw-semibold" style="width: 5%;">No.</th>
                        <th class="py-3 px-2 border-bottom-0 fw-semibold" style="width: 10%;">Product ID</th>
                        <th class="py-3 px-2 border-bottom-0 fw-semibold" style="width: 35%;">Product Name</th>
                        <th class="py-3 px-2 border-bottom-0 text-end fw-semibold" style="width: 15%;">Unit Price</th>
                        <th class="py-3 px-2 border-bottom-0 text-center fw-semibold" style="width: 15%;">Quantity</th>
                        <th class="py-3 px-2 border-bottom-0 text-end fw-semibold" style="width: 10%;">Subtotal</th>
                        <th class="py-3 px-4 border-bottom-0 text-center fw-semibold" style="width: 10%;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ctd, index) in cartDtl" :key="index" class="border-bottom">
                        <td class="py-3 px-4 text-muted">{{ ctd.row_number || (index + 1) }}</td>
                        <td class="py-3 px-2 text-muted" style="font-family: monospace;">{{ String(ctd.pdId).padStart(3, '0') }}</td>
                        <td class="py-3 px-2">
                            <div class="d-flex align-items-center gap-3">
                                <img :src="`http://localhost:3000/img_pd/${ctd.pdId}.jpg`" class="rounded object-fit-cover border" width="48" height="48" alt="">
                                <span class="fw-semibold text-dark">{{ ctd.pdName }}</span>
                            </div>
                        </td>

                        <td class="py-3 px-2 text-end text-muted">{{ (ctd.price ?? 0).toLocaleString() }}</td>
                        <td class="py-3 px-2">
                            <div class="input-group input-group-sm mx-auto" style="width: 100px;">
                                <button class="btn btn-outline-secondary px-2" type="button" @click="updateQty(ctd, -1)">-</button>
                                <input type="text" class="form-control text-center fw-semibold border-secondary bg-white px-0" :value="ctd.qty" readonly>
                                <button class="btn btn-outline-secondary px-2" type="button" @click="updateQty(ctd, 1)">+</button>
                            </div>
                        </td>

                        <td class="py-3 px-2 text-end fw-semibold text-dark">{{ ((ctd.price * ctd.qty) ?? 0).toLocaleString() }}</td>
                        <td class="py-3 px-2 text-center">
                            <button class="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1 mx-auto text-nowrap px-3" style="border-radius: 6px; font-size: 0.85rem;" @click="removeItem(ctd)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                                ลบรายการ
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>    

        <div class="card shadow-sm border-0" style="border-radius: 12px;" v-if="cart.length > 0">
            <div class="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex align-items-baseline gap-2 mb-1">
                        <span class="text-secondary fs-5">จำนวนสินค้า</span>
                        <span class="fw-bold fs-4 text-dark">{{ cart[0].sqty }}</span>
                        <span class="text-secondary fs-5">ชิ้น, ยอดเงิน</span>
                        <span class="fw-bold fs-3 text-dark">{{ (cart[0].sprice ?? 0).toLocaleString() }}</span>
                        <span class="text-secondary fs-5">บาท</span>
                    </div>
                    <div class="text-muted d-flex align-items-center gap-1" style="font-size: 0.8rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                        เมื่อยืนยันแล้วจะไม่สามารถลบหรือแก้ไขรายการได้
                    </div>
                </div>

                <button class="btn btn-cart fw-semibold px-4 py-3 d-flex align-items-center gap-2 fs-5" @click="confirmOrder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                    ยืนยันสั่งสินค้า
                </button>
            </div>
        </div>
    </div>
    <div v-else class="container my-5 text-center">
        <div class="alert alert-danger shadow-sm border-0 d-inline-block px-5 py-4" style="border-radius: 12px;">
            <h5 class="alert-heading fw-bold mb-2">คุณไม่มีสิทธิ์เข้าถึงรายการนี้</h5>
            <p class="mb-0">กรุณาเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios';
axios.defaults.withCredentials = true

const route = useRoute()
const cart=ref([])
const cartDtl=ref([])
const cartId=ref(null)
const cusId=ref(null)
const memEmail=ref(null)

const formattedDate=(dateStr)=> {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth()+ 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
onMounted(async ()=>{
    await getMember()
    await getActiveCart()
})

const getActiveCart = async () =>{
    let members = { memEmail: memEmail.value };
    try{
        const response = await axios.post(`http://localhost:3000/carts/chkcart`, members);
        cartId.value = response.data.cartId;

        if (cartId.value){
            await getCart()
            await getCartDtl()
        }
        else{
            console.log("ไม่มีสินค้าในตะกร้า")
            cart.value = [];
        }
    }
    catch (err){
        console.log(err.message);
    }
}


const getCart=async ()=>{
    console.log('Get Cart:'+cartId.value)
    await axios.get(`http://localhost:3000/carts/getcart/${cartId.value}`)
        .then(res => {
            cart.value = res.data
            cusId.value = cart.value[0].cusId
        })
        .catch(err => {  console.error(err); });      
}
const getCartDtl=async ()=>{
    console.log('Get Cart Detail:'+cartId.value)
    await axios.get(`http://localhost:3000/carts/getcartdtl/${cartId.value}`)
        .then(res => {
            cartDtl.value = res.data
        })
        .catch(err => {  console.error(err); });      
}
const getMember=async ()=>{
    await axios.get(`http://localhost:3000/members/detail`)
        .then((res)=>{
            memEmail.value=res.data.memEmail
        })
        .catch(err=>console.log(err.message))
}

const confirmDeleteCart = () => {
  if(confirm('ยืนยันลบตะกร้าสินค้านี้ทั้งหมด?')) {
    console.log("Deleted Cart:", cartId.value)
  }
}

const confirmOrder = () => {
  if(confirm('ยืนยันสั่งสินค้า?')) {
    console.log("Confirmed Order:", cartId.value)
  }
}

const updateQty = (item, amount) => {
  if(item.qty + amount > 0) {
    console.log(`Update ${item.pdId} qty to ${item.qty + amount}`)
  }
}

const removeItem = (item) => {
  if(confirm(`ยืนยันลบสินค้า ${item.pdName} ออกจากตะกร้า?`)) {
    console.log("Remove Item:", item.pdId)
  }
}
</script>

<style scoped>
.btn-cart {
  background-color: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-cart:hover {
  background-color: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(249, 115, 22, 0.25);
}

.table th {
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}
</style>