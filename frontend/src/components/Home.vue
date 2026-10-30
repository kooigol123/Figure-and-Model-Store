<template>
    <div class="container mt-4 mb-5">

        <!-- header -->
        <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
                <p class="text-secondary fw-bold mb-1" style="font-size: 0.85rem; letter-spacing: 1px;">MODEL & FIGURE STORE</p>
                <h2 class="fw-bold mb-2">ร้านโมเดลและฟิกเกอร์</h2>
                <p class="text-secondary" style="font-size: 0.95rem;">
                    ฟิกเกอร์อนิเมะ เนนโดรอยด์ และโมเดลกันพลาของแท้ เลือกสินค้า ใส่ตะกร้า และยืนยันคำสั่งซื้อได้ในที่เดียว
                </p>
            </div>

            <div v-if="dutyId === 'admin'" class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill d-flex align-items-center gap-1 shadow-sm mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
                    <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                    <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Admin view
            </div>
        </div>

        <!-- ช่องค้นหา -->
         <div class="card shadow-sm border-0 rounded-3 mb-5 py-2 px-3">
            <div class="row g-3 align-items-center">
                <div class="col-lg-5 col-md-12">
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0 text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </span>
                        <input type="text" class="form-control border-start-0 ps-0 search-input" placeholder="ค้นหาตามชื่อสินค้า หรือแบรนด์" v-model="stext">

                        <span class="input-group-text bg-white border-start-0" style="cursor: pointer;" v-if="stext" @click="stext = ''">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" class="bi bi-x-lg hover-orange" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <select class="form-select custom-select" :class="{ 'text-muted': !selectedCat }" v-model="selectedCat">
                        <option value="">ทุกหมวดหมู่</option>
                        <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">{{ cat.categoryName }}</option>
                    </select>
                </div>

                <div class="col-lg-4 col-md-6 d-flex justify-content-between align-items-center">
                    <div class="text-muted" style="font-size: 0.9rem;">
                        พบ <span class="fw-bold text-dark">{{ filteredProducts.length }}</span> รายการ
                    </div>
                    
                    <button v-if="dutyId === 'admin'" class="btn btn-orange text-white fw-semibold px-3 py-2 shadow-sm d-flex align-items-center gap-1" style="border-radius: 8px; font-size: 0.85rem;" @click="addingProduct = true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>
                        เพิ่มสินค้า
                    </button>
                </div>
            </div>
         </div>

         <!-- รายการสินค้า -->
        <div class="row g-4" v-if="filteredProducts.length > 0">
            <div v-for="(pd, index) in filteredProducts" :key="pd.pdId" class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <div class="card h-100 shadow-sm border-0 product-card">
                    <router-link :to="{name: 'ProductShow', params:{pdId:pd.pdId}}" class="text-decoration-none">
                        <div class="img-wrapper">
                            <img :src="productImg(pd)" class="card-img-top p2" alt="">
                        </div>
                    </router-link>
                    <div class="card-body d-flex flex-column p-3">
                        <div class="d-flex justify-content-between text-muted mb-2" style="font-size: 0.75rem;">
                            <span>ID {{ String(pd.pdId).padStart(3, '0') }}</span>
                            <span>{{ pd.category?.categoryName || 'หมวดหมู่สินค้า' }}</span>
                        </div>
                        <router-link :to="{name: 'ProductShow', params:{pdId:pd.pdId}}" class="text-decoration-none">
                            <h6 class="card-title fw-bold text-dark mb-3 text-truncate-2" style="font-size: 0.95rem; line-height: 1.4;">
                                {{ pd.pdName }}
                            </h6>
                        </router-link>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-secondary" style="font-size: 0.8rem;">
                                {{ pd.brand?.brandName ?? 'ไม่ระบุแบรนด์' }}
                            </span>
                            <span class="fw-bold text-dark" style="font-size: 1.05rem;">
                                {{ pd.price ? Number(pd.price).toLocaleString() : '0' }} THB
                            </span>
                        </div>
                        <p class="card-text text-secondary mb-4 text-truncate-2" style="font-size: 0.75rem;">
                            {{ pd.description || 'รายละเอียดสินค้าเบื้องต้น...' }}
                        </p>

                        <div class="d-flex gap-2 mt-auto">
                            <button class="btn btn-cart fw-semibold d-flex align-items-center justify-content-center gap-2" :class="dutyId === 'admin' ? 'w-75' : 'w-100'" @click="addToCart(pd)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                </svg>
                                ใส่ตะกร้า
                            </button>

                            <button v-if="dutyId === 'admin'" class="btn btn-warning fw-semibold text-dark w-25 d-flex align-items-center justify-content-center gap-1 shadow-sm" style="border-radius: 8px; font-size: 0.9rem;" @click="editingProduct = pd">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                                แก้ไข
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-5 my-4" style="background-color: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px;">
            <div class="d-flex justify-content-center mb-3">
                <div class="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style="width: 56px; height: 56px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#64748b" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.84l-6.5-2.6v7.922zM2.053 3.963l-1-.4v.5z"/>
                    </svg>
                </div>
            </div>
            <h6 class="fw-bold mb-2" style="color: #0f172a;">ไม่พบสินค้าที่ตรงกับการค้นหา</h6>
            <p class="text-secondary mb-4" style="font-size: 0.9rem;">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            <button class="btn bg-white border fw-semibold px-4 py-2 hover-gray" style="border-radius: 8px; color: #334155; border-color: #e2e8f0 !important;" @click="stext = ''; selectedCat = ''">
                ล้างตัวกรอง
            </button>
        </div>

        <ProductEditModal v-if="editingProduct" :product="editingProduct" :categories="categories" :image-url="productImg(editingProduct)"
            @close="editingProduct = null" @saved="onProductSaved" @deleted="onProductDeleted" />
        <ProductEditModal v-if="addingProduct" :categories="categories"
            @close="addingProduct = false" @saved="onProductSaved" />
    </div>
</template>

<script setup>

import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import ProductEditModal from './ProductEditModal.vue';

    const authStore = useAuthStore()

    // แก้ไขสินค้า (admin)
    const editingProduct = ref(null)
    const addingProduct = ref(false)
    const imgVersion = ref(Date.now()) // เปลี่ยนเมื่ออัปโหลดรูปใหม่ เพื่อให้รูปโหลดใหม่ทันที
    const productImg = (pd) => `http://localhost:3000/img_pd/${pd.pdId}.jpg?v=${imgVersion.value}`

    const onProductSaved = (updated, imageChanged, isNew) => {
        getCategories()
        if (isNew) {
            products.value = [...products.value, updated]
        } else {
            products.value = products.value.map(p => p.pdId === updated.pdId ? updated : p)
        }
        if (imageChanged) imgVersion.value = Date.now()
        editingProduct.value = null
        addingProduct.value = false
    }

    const onProductDeleted = (pdId) => {
        products.value = products.value.filter(p => p.pdId !== pdId)
        editingProduct.value = null
    }

    const router = useRouter()
    const products = ref([])
    const stext = ref("")
    const cartStore = useCartStore();
    const dutyId = ref(null)

    const searhProduct = async ()=>{
        console.log(`searchProduct -->${stext.value}`)
        await axios.get(`http://localhost:3000/products/search/${stext.value}`)
        .then((res)=>{
            products.value=res.data
        })
        .catch(err=>console.log(err.message))
    }

    const categories = ref([])
    const selectedCat = ref("") // "" = ทุกหมวดหมู่

    // กรองตามหมวดหมู่จากรายการที่ได้ (ทำงานร่วมกับช่องค้นหา)
    const filteredProducts = computed(() => {
        if (!selectedCat.value) return products.value
        return products.value.filter(pd => pd.categoryId === selectedCat.value)
    })

    const fetchCategories = async () => {
        await axios.get(`http://localhost:3000/categories`)
        .then((res) => { categories.value = res.data })
        .catch(err => console.log(err.message))
    }

    onMounted(async ()=>{
        await checkUserDuty()
        fetchAllProducts()
        fetchCategories()
    })

    const fetchAllProducts = async()=>{
        await axios.get(`http://localhost:3000/products`)
        .then((res)=>{ products.value = res.data })
        .catch(err => console.log(err.message))
    }

    const checkUserDuty = async () => {
        const user = await authStore.fetchMe()
        dutyId.value = user?.role ?? null
    }

    watch(stext, async (newValue) =>{
        if(!newValue.trim()){
            fetchAllProducts();
            return;
        }

        await axios.get(`http://localhost:3000/products/search/${newValue}`)
        .then((res) =>{
            products.value = res.data
        })
        .catch(err => console.log(err.message))
    })

    const addToCart = async (pd) =>{
        try{
            const user = await authStore.fetchMe();

            if (user){
                const userId = user.id;
                let currentCartId = null;

                const resChkCart = await axios.post(`http://localhost:3000/carts/chkcart`, { userId })
                currentCartId = resChkCart.data.cartId

                if (!currentCartId){
                    const resAddCart = await axios.post(`http://localhost:3000/carts/addcart`, { userId })
                    currentCartId = resAddCart.data.cartId
                }

                const cartdtl = {
                    cartId: currentCartId,
                    pdId: pd.pdId,
                    price: pd.price
                }

                await axios.post(`http://localhost:3000/carts/addcartdtl`, cartdtl)

                cartStore.updateQty()
                cartStore.setId(currentCartId)

                alert(`เพิ่ม ${pd.pdName} ลงตะกร้าเรียบร้อยแล้ว!`)
            }
            else{
                router.push('/login')
            }
        }
        catch (err){
            console.error("Error adding to cart:", err)
            router.push('/login')
        }
    }
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9 !important;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
}

.img-wrapper {
  background-color: #f8f9fa;
  border-bottom: 1px solid #f1f5f9;
  overflow: hidden;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .img-wrapper img {
    transform: scale(1.08);
}

.card-title {
  min-height: 2.7rem;
  transition: color 0.2s ease;
}

.product-card:hover .card-title {
  color: #ea580c !important;
}

.product-link {
  color: #212529;
  transition: color 0.2s ease;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.btn-cart, .btn-orange {
  background-color: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem;
  transition: background-color 0.2s;
}

.btn-cart:hover, .btn-orange:hover {
  background-color: #ea580c; 
  color: white;
}

.search-input:focus, .custom-select:focus {
  border-color: #f97316;
  box-shadow: none;
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .search-input {
  border-color: #f97316;
}

.btn-warning {
  background-color: #facc15;
  border-color: #facc15;
  transition: all 0.2s ease;
}
.btn-warning:hover {
  background-color: #eab308;
  border-color: #eab308;
}
</style>
