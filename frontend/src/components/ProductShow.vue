<template>
    <div class="product-detail-container my-4">
        <div v-for="(pd, pdId) in products" :key="pdId">

            <!-- Breadcrumb Navigation -->
            <div class="d-flex align-items-center mb-4 breadcrumb-nav">
                <router-link to="/product" class="text-decoration-none breadcrumb-back d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                    สินค้าทั้งหมด
                </router-link>
                <span class="mx-2 text-muted">›</span>
                <span class="text-muted">{{ pd.pdName }}</span>
            </div>

            <div class="row g-5 align-items-start">
                <!-- ฝั่งซ้าย: รูปภาพสินค้าทรงสี่เหลี่ยมจัตุรัสตาม Figma -->
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="product-detail-img-box rounded-4 overflow-hidden">
                        <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
                             @error="$event.target.onerror = null; $event.target.src='http://localhost:3000/img_pd/default.jpg'"
                             alt="Product Image"
                             class="product-detail-img">
                    </div>
                </div>

                <!-- ฝั่งขวา: รายละเอียดสินค้าตาม Figma -->
                <div class="col-lg-6 col-md-6">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span class="badge badge-category">
                            {{ cleanCategory(pd.category?.categoryName) }}
                        </span>
                        <span class="text-muted" style="font-size: 0.8rem;">
                            ID {{ String(pd.pdId).padStart(3, '0') }}
                        </span>
                    </div>

                    <h2 class="product-title fw-bold mb-1">{{ pd.pdName }}</h2>
                    <p class="text-secondary mb-3" style="font-size: 0.95rem;">{{ pd.brand?.brandName || "Good Smile Company" }}</p>
                    
                    <div class="product-price fw-bold mb-4">
                        {{ pd.price ? Number(pd.price).toLocaleString() : '0' }} THB
                    </div>

                    <!-- ข้อมูลสินค้า (Specifications) -->
                    <div class="section-subtitle fw-bold mb-2">ข้อมูลสินค้า (Specifications)</div>
                    <div class="specs-card mb-4">
                        <div class="specs-row">
                            <div class="specs-label">รหัสสินค้า (Product ID)</div>
                            <div class="specs-value">{{ String(pd.pdId).padStart(3, '0') }}</div>
                        </div>
                        <div class="specs-row">
                            <div class="specs-label">ชื่อสินค้า (Product Name)</div>
                            <div class="specs-value">{{ pd.pdName }}</div>
                        </div>
                        <div class="specs-row">
                            <div class="specs-label">แบรนด์ (Brand)</div>
                            <div class="specs-value">{{ pd.brand?.brandName || "ไม่ระบุแบรนด์" }}</div>
                        </div>
                        <div class="specs-row">
                            <div class="specs-label">หมวดหมู่ (Category)</div>
                            <div class="specs-value">{{ pd.category?.categoryName || 'สเกลฟิกเกอร์' }}</div>
                        </div>
                        <div class="specs-row border-0">
                            <div class="specs-label">ราคา (Price)</div>
                            <div class="specs-value">{{ pd.price ? Number(pd.price).toLocaleString() : '0' }} THB</div>
                        </div>
                    </div>

                    <!-- รายละเอียดสินค้า (Description) -->
                    <div class="section-subtitle fw-bold mb-2">รายละเอียดสินค้า (Description)</div>
                    <p class="product-description mb-4">
                        {{ pd.description || 'ไม่มีรายละเอียดสินค้า' }}
                    </p>

                    <!-- จำนวน และปุ่มใส่ตะกร้า (ตาม Figma) -->
                    <div class="d-flex align-items-end gap-3 pt-2">
                        <div>
                            <div class="text-secondary mb-1" style="font-size: 0.75rem;">จำนวน</div>
                            <div class="quantity-stepper">
                                <button type="button" class="stepper-btn" @click="qty > 1 ? qty-- : null">-</button>
                                <input type="text" class="stepper-input" v-model="qty" readonly>
                                <button type="button" class="stepper-btn" @click="qty++">+</button>
                            </div>
                        </div>

                        <div class="flex-grow-1">
                            <button class="btn btn-cart w-100 fw-semibold d-flex align-items-center justify-content-center gap-2" @click="chkLogin()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
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
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import { useCartStore } from '@/stores/cartStore';
    import { useAuthStore } from '@/stores/authStore';

    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const products = ref([]);
    const id = ref(null);
    const login = ref(false);
    const userId = ref(null);
    const cartId = ref(null);
    const cartStore = useCartStore();

    const qty = ref(1);

    const cleanCategory = (catName) => {
        if (!catName) return 'สเกลฟิกเกอร์';
        return catName;
    };

    onMounted(async () => {
        id.value = route.params.pdId;
        axios.get(`http://localhost:3000/products/${id.value}`)
            .then(res => {
                products.value = [res.data];
            })
            .catch(err => console.log(err.message));
    });

    const chkLogin = async () => {
        const user = await authStore.fetchMe();
        login.value = !!user;
        userId.value = user?.id;

        if (login.value) {
            await chkCart();
            if (!cartId.value) {
                await addCart();
            }
            await addCartDtl();
        } else {
            router.push('/login');
        }
    };

    const chkCart = async () => {
        let members = { userId: userId.value };
        try {
            const response = await axios.post(`http://localhost:3000/carts/chkcart`, members);
            cartId.value = response.data.cartId;
        } catch (err) {
            console.log(err);
        }
    };

    const addCart = async () => {
        let customer = { userId: userId.value };
        try {
            const response = await axios.post(`http://localhost:3000/carts/addcart`, customer);
            cartId.value = response.data.cartId;
        } catch (err) {
            console.log(err);
        }
    };

    const addCartDtl = async () => {
        let cartdtl = {
            cartId: cartId.value,
            pdId: id.value,
            price: products.value[0].price
        };
        try {
            for (let i = 0; i < qty.value; i++) {
                await axios.post(`http://localhost:3000/carts/addcartdtl`, cartdtl);
            }
            cartStore.updateQty();
            cartStore.setId(cartId.value);
            qty.value = 1;
            alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!");
        } catch (err) {
            console.log(err);
        }
    };
</script>

<style scoped>
.product-detail-container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 20px 24px 60px;
}

.breadcrumb-nav {
    font-size: 0.88rem;
}

.breadcrumb-back {
    color: #2563eb;
    font-weight: 500;
    transition: color 0.15s ease;
}

.breadcrumb-back:hover {
    color: #1d4ed8;
}

.product-detail-img-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
}

.product-detail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
}

.product-detail-img-box:hover .product-detail-img {
    transform: scale(1.02);
}

.badge-category {
    background-color: #eff6ff;
    color: #2563eb;
    border: 1px solid #dbeafe;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 500;
    padding: 3px 10px;
}

.product-title {
    font-size: 1.75rem;
    color: #0f172a;
    letter-spacing: -0.4px;
}

.product-price {
    font-size: 1.85rem;
    color: #0f172a;
    letter-spacing: -0.5px;
}

.section-subtitle {
    font-size: 0.95rem;
    color: #0f172a;
}

.specs-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background-color: #ffffff;
    overflow: hidden;
}

.specs-row {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.86rem;
}

.specs-label {
    width: 38%;
    color: #64748b;
}

.specs-value {
    width: 62%;
    color: #0f172a;
}

.product-description {
    color: #475569;
    font-size: 0.88rem;
    line-height: 1.65;
}

.quantity-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    overflow: hidden;
    height: 46px;
    background: #ffffff;
}

.stepper-btn {
    width: 38px;
    height: 100%;
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.stepper-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
}

.stepper-input {
    width: 44px;
    height: 100%;
    border: none;
    border-left: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    text-align: center;
    font-weight: 600;
    font-size: 0.95rem;
    color: #0f172a;
    background: #ffffff;
}

.stepper-input:focus {
    outline: none;
}

.btn-cart {
    height: 46px;
    background-color: #f97316;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(249, 115, 22, 0.2);
}

.btn-cart:hover {
    background-color: #ea580c;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
}
</style>
