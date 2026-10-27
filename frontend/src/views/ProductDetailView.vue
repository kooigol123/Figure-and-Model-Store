<template>
  <div class="detail-page-container">
    <div class="detail-content-wrapper">
      
      <div class="navigation-bar-top">
        <button @click="goBack" class="btn-back">← กลับหน้ารายการสินค้า</button>
        <span class="path-indicator">รายละเอียดฟิกเกอร์</span>
      </div>

      <div class="product-detail-card" v-if="product">
        <div class="detail-image-box">
          <span class="badge-tag">{{ product.categoryName || 'ฟิกเกอร์' }}</span>
          <img 
            v-if="product.image" 
            :src="`http://localhost:3000${product.image}`" 
            :alt="product.pdName" 
            class="detail-img"
          />
          <span v-else class="detail-placeholder">📦</span>
        </div>

        <div class="detail-info-box">
          <span class="brand-tag-top">{{ product.brandName || 'ลิขสิทธิ์แท้' }}</span>
          <h1 class="product-main-title">{{ product.pdName }}</h1>
          
          <div class="price-stock-row">
            <span class="product-price-large">฿{{ Number(product.price || 0).toLocaleString() }}</span>
            <span class="stock-status-badge">🟢 มีสินค้าพร้อมส่ง (10 ชิ้น)</span>
          </div>

          <p class="description-text">{{ product.description || 'ไม่มีรายละเอียดสินค้าเพิ่มเติม' }}</p>

          <div class="quantity-control-wrapper">
            <label>จำนวน:</label>
            <div class="qty-btn-group">
              <button @click="decreaseQty" class="qty-btn">-</button>
              <span class="qty-number">{{ quantity }}</span>
              <button @click="increaseQty" class="qty-btn">+</button>
            </div>
          </div>

          <div class="action-buttons-group">
            <button @click="addToCart" class="btn-add-cart">🛒 เพิ่มลงตะกร้า</button>
            <button @click="buyNow" class="btn-buy-now">⚡ สั่งซื้อทันที</button>
          </div>
        </div>
      </div>

      <div v-else class="loading-state">
        <p>กำลังโหลดข้อมูลสินค้า...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const quantity = ref(1)

const fetchProductDetail = async () => {
  try {
    const pdId = route.params.id
    const response = await api.getProductById(pdId)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product detail:', error)
  }
}

onMounted(fetchProductDetail)

const goBack = () => router.push('/products')
const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }
const increaseQty = () => { quantity.value++ }

const addToCart = () => {
  alert(`🛒 เพิ่ม "${product.value?.pdName}" จำนวน ${quantity.value} ชิ้นลงในตะกร้าแล้ว!`)
}

const buyNow = () => {
  alert(`⚡ ดำเนินการสั่งซื้อ "${product.value?.pdName}" จำนวน ${quantity.value} ชิ้น`)
  router.push('/cart')
}
</script>

<style scoped>
.detail-page-container {
  background: #f8fafc;
  min-height: calc(100vh - 65px);
  padding: 40px 20px;
  color: #0f172a;
}

.detail-content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.navigation-bar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-back {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-back:hover {
  background: #f1f5f9;
}

.path-indicator {
  font-size: 13px;
  color: #94a3b8;
}

.product-detail-card {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 40px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.detail-image-box {
  width: 100%;
  height: 420px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.detail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-placeholder {
  font-size: 72px;
}

.badge-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #f97316;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
}

.detail-info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-tag-top {
  font-size: 13px;
  color: #f97316;
  font-weight: 600;
  margin-bottom: 6px;
}

.product-main-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
}

.price-stock-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.product-price-large {
  font-size: 32px;
  font-weight: 800;
  color: #f97316;
}

.stock-status-badge {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
}

.description-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 0;
}

.quantity-control-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.quantity-control-wrapper label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.qty-btn-group {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
}

.qty-btn {
  background: transparent;
  border: none;
  color: #0f172a;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}

.qty-btn:hover {
  background: #f1f5f9;
}

.qty-number {
  padding: 0 16px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.action-buttons-group {
  display: flex;
  gap: 16px;
}

.btn-add-cart {
  flex: 1;
  background: #ffffff;
  border: 1px solid #f97316;
  color: #f97316;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-add-cart:hover {
  background: #fff7ed;
}

.btn-buy-now {
  flex: 1;
  background: #f97316;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-buy-now:hover {
  background: #ea580c;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #64748b;
}

@media (max-width: 768px) {
  .product-detail-card {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>