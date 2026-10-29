<template>
    <div class="container my-4">
        <div v-for="(pd, pdId) in products" :key="pdId" class="mt-5">

            <div class="d-flex align-items-center mb-4" style="font-size: 0.9rem;">
                <router-link to="/product" class="text-decoration-none text-secondary d-flex align-items-center gap-1 hover-orange">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                    สินค้าทั้งหมด
                </router-link>
                <span class="mx-2 text-secondary">›</span>
                <span class="text-dark">{{ pd.pdName }}</span>
            </div>

            <div class="row g-4">
                <div class="col-lg-5 col-md-6 col-sm-12">
                    <div>
                        <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" alt="Product Image" class="img-fluid rounded-4 shadow-sm w-100 object-fit: contain;" style="max-height: 550px; object-position: top;">
                    </div>
                </div>
            

                <div class="col-lg-7 col-md-6">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <span class="badge text-dark fw-normal px-3 py-2" style="background-color: #f1f5f9; border-radius: 6px;">
                            {{ pd.category?.categoryName || 'สเกลฟิกเกอร์' }}
                        </span>
                        <span class="text-muted fw-semibold" style="font-size: 0.85rem; letter-spacing: 0.5px;">
                            ID {{ String(pd.pdId).padStart(3, '0') }}
                        </span>
                    </div>

                    <h3 class="fw-bold mb-1">{{ pd.pdName }}</h3>
                    <p class="text-secondary mb-3">{{ pd.brand?.brandName || "Good Smile Company" }}</p>
                    <h3 class="fw-bold mb-4" style="color: #0f172a;">
                        {{ pd.price ? Number(pd.price).toLocaleString() : '0' }} THB
                    </h3>
                    <h6 class="fw-bold mb-2" style="color: #334155;">ข้อมูลสินค้า (Specifications)</h6>
                    <div class="border rounded-3 overflow-hidden mb-3">
                        <table class="table table-borderless mb-0 align-middle" style="font-size: 0.85rem;">
                            <tbody>
                                <tr class="border-bottom">
                                    <td class="text-muted bg-light px-4 py-2" style="width: 35%;">รหัสสินค้า (Product ID)</td>
                                    <td class="px-4 py-2">{{ String(pd.pdId).padStart(3, '0') }}</td>
                                </tr>
                                <tr class="border-bottom">
                                    <td class="text-muted bg-light px-4 py-2">ชื่อสินค้า (Product Name)</td>
                                    <td class="px-4 py-2">{{ pd.pdName }}</td>
                                </tr>
                                <tr class="border-bottom">
                                    <td class="text-muted bg-light px-4 py-2">แบรนด์ (Brand)</td>
                                    <td class="px-4 py-2">{{ pd.brand?.brandName || "ไม่ระบุแบรนด์" }}</td>
                                </tr>
                                <tr class="border-bottom">
                                    <td class="text-muted bg-light px-4 py-2">หมวดหมู่ (Category)</td>
                                    <td class="px-4 py-2">{{ pd.category?.categoryName || 'สเกลฟิกเกอร์' }}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted bg-light px-4 py-2">ราคา (Price)</td>
                                    <td class="px-4 py-2">{{ pd.price ? Number(pd.price).toLocaleString() : '0' }} THB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h6 class="fw-bold mb-1" style="color: #334155; font-size: 0.9rem;">รายละเอียดสินค้า (Description)</h6>
                    <p class="text-secondary mb-4" style="font-size: 0.85rem; line-height: 1.5; display: -webkit-box; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        {{ pd.description || 'ไม่มีรายละเอียดสินค้า' }}
                    </p>

                    <hr class=" text-muted" style="opacity: 0.15;">
                    <div class="d-flex align-items-end gap-3 mt-auto">
                        <div class="d-flex flex-column">
                            <span class="text-secondary mb-1" style="font-size: 0.75rem;">จำนวน</span>
                            <div class="input-group" style="width: 120px;">
                                <button class="btn btn-outline-secondary px-3" type="button" @click="qty > 1 ? qty-- : null">-</button>
                                <input type="text" class="form-control text-center fw-semibold border-secondary bg-white" v-model="qty" readonly>
                                <button class="btn btn-outline-secondary px-3" type="button" @click="qty++">+</button>
                            </div>
                        </div>

                        <div class="flex-grow-1">
                            <button class="btn btn-cart w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2 fs-6" @click="chkLogin()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                </svg>
                                ใส่ตะกร้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    import axios from 'axios';
    import { useCartStore } from '@/stores/cartStore'
    import { useAuthStore } from '@/stores/authStore'

    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const products=ref([])
    const id=ref(null)
    const login=ref(false)
    const userId=ref(null)
    const cartId=ref(null)
    const backendMessage=ref(null)
    const cartStore = useCartStore()

    const qty = ref(1)

    onMounted(async ()=>{
        id.value= route.params.pdId
        axios.get(`http://localhost:3000/products/${id.value}`)
        .then(res => {
        products.value = [res.data]; // backend ส่งมาเป็น object เดียว
        })
        .catch(err=>console.log(err.message))
    })

    const chkLogin=async()=>{
        const user = await authStore.fetchMe()
        login.value = !!user
        userId.value = user?.id

        if(login.value){
            console.log("Login:"+login.value)
            await chkCart()
            if(!cartId.value){
                await addCart()
            }
            await addCartDtl()
        }
        else{
            router.push('/login')
        }
    }

    const chkCart=async()=>{
        console.log('chkCart')
        let members={
            userId:userId.value
        }
        try{
            const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
            cartId.value=response.data.cartId
            console.log(cartId.value)
        }
        catch(err){console.log(err)}  
    }

    const addCart=async ()=>{
        console.log("addCard")
        let customer = {
            userId:userId.value
        }
        try{
            const response = await axios.post(`http://localhost:3000/carts/addcart`,customer)
            cartId.value=response.data.cartId
            console.log( response.data)
        }
        catch(err){
            console.log(err)
        }
    }

    const addCartDtl=async ()=>{
        console.log("addCartDtl")
        let cartdtl={
            cartId:cartId.value,
            pdId:id.value,
            price:products.value[0].price
        }
        console.log(cartdtl)
        try{
            // backend เพิ่มทีละ 1 ชิ้น จึงเรียกตามจำนวนที่เลือก
            for (let i = 0; i < qty.value; i++) {
                await axios.post(`http://localhost:3000/carts/addcartdtl`,cartdtl)
            }
            cartStore.updateQty()
            cartStore.setId(cartId.value)
            qty.value = 1
            alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!")
        }
        catch(err){
            console.log(err)
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}

.hover-orange {
  transition: color 0.2s;
}

.hover-orange:hover {
  color: #f97316 !important;
}

.input-group .btn-outline-secondary {
  border-color: #dee2e6;
  color: #475569;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #0f172a;
}

.input-group .form-control {
  border-color: #dee2e6;
}
</style>