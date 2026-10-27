<template>
  <div class="products-container">
    <main class="main-content">
      
      <!-- ส่วนหัวข้อจัดระเบียบชิดซ้าย สวยงามในแนวเดียวกับหน้า Home -->
      <div class="hero-section">
        <div class="header-content-wrapper">
          <p class="sub-label">PRODUCTS</p>
          <h1 class="main-heading">สินค้าทั้งหมด</h1>
          <p class="desc-text">
            สินค้าในระบบทั้งหมด {{ products.length }} รายการ จาก 4 หมวดหมู่
          </p>
        </div>
      </div>

      <div class="filter-card">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="ค้นหาตามชื่อสินค้า หรือแบรนด์" 
          />
        </div>

        <div class="select-wrapper">
          <select v-model="selectedCategory">
            <option value="">ทุกหมวดหมู่</option>
            <option value="Scale Figure">สเกลฟิกเกอร์ (Scale Figure)</option>
            <option value="Nendoroid">เนนโดรอยด์ (Nendoroid)</option>
            <option value="Model Kit">โมเดลกันพลา (Model Kit)</option>
            <option value="Prize Figure">ฟิกเกอร์รางวัล (Prize Figure)</option>
          </select>
        </div>

        <div class="total-count-label">
          พบ <strong>{{ filteredProducts.length }}</strong> รายการ
        </div>
      </div>

      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.pdId" 
          class="product-card"
        >
          <div class="product-image-box" @click="viewDetail(product.pdId)" title="คลิกเพื่อดูรายละเอียด">
            <img 
              v-if="product.image" 
              :src="`http://localhost:3000${product.image}`" 
              :alt="product.pdName" 
              class="product-img"
            />
            <span v-else class="image-placeholder">📦</span>
          </div>

          <div class="product-info-box">
            <div class="card-meta">
              <span class="pd-id">ID {{ String(product.pdId).padStart(3, '0') }}</span>
              <span class="pd-category">{{ product.categoryName || 'ฟิกเกอร์' }}</span>
            </div>

            <h3 class="pd-title" @click="viewDetail(product.pdId)" title="คลิกเพื่อดูรายละเอียด">{{ product.pdName }}</h3>
            
            <div class="pd-brand-price">
              <span class="pd-brand">{{ product.brandName || 'Good Smile Company' }}</span>
              <span class="pd-price">{{ Number(product.price || 0).toLocaleString() }} THB</span>
            </div>

            <p class="pd-desc">{{ product.description || 'ไม่มีรายละเอียดสินค้า' }}</p>

            <button @click="addToCart(product)" class="btn-orange-cart">
              🛒 ใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const products = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')

const fetchProducts = async () => {
  try {
    const response = await api.getProducts()
    products.value = Array.isArray(response.data) ? response.data : (response.data?.products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const viewDetail = (pdId) => {
  router.push(`/products/${pdId}`)
}

const addToCart = (product) => {
  alert(`🛒 เพิ่ม "${product.pdName}" ลงในตะกร้าแล้ว!`)
}

const filteredProducts = computed(() => {
  if (!products.value) return []
  let result = products.value

  if (searchQuery.value) {
    result = result.filter(p =>
      p.pdName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.brandName?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.categoryName === selectedCategory.value)
  }

  return result
})

onMounted(fetchProducts)
</script>

<style scoped>
.products-container {
  min-height: calc(100vh - 65px);
  background: #f8fafc;
  color: #0f172a;
  padding-bottom: 60px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 🌟 จัดระเบียบส่วนหัวชิดซ้าย คุมระยะห่างให้สมดุล */
.hero-section {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.header-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 0;
}

.main-heading {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.desc-text {
  font-size: 13px;
  color: #64748b;
  max-width: 700px;
  line-height: 1.5;
  margin: 4px 0 0 0;
}

.filter-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 12px 20px;
  border-radius: 14px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 12px;
  width: 280px;
}

.search-icon {
  font-size: 14px;
  color: #94a3b8;
  margin-right: 8px;
}

.search-input-wrapper input {
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 13px;
  width: 100%;
  color: #0f172a;
}

.select-wrapper select {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  color: #0f172a;
  cursor: pointer;
}

.total-count-label {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

.product-image-box {
  height: 220px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-image-box:hover .product-img {
  transform: scale(1.05);
}

.image-placeholder {
  font-size: 48px;
}

.product-info-box {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.pd-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s;
}

.pd-title:hover {
  color: #f97316;
}

.pd-brand-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pd-brand {
  font-size: 12px;
  color: #64748b;
}

.pd-price {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.pd-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}

.btn-orange-cart {
  margin-top: auto;
  width: 100%;
  background: #f97316;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-orange-cart:hover {
  background: #ea580c;
}
</style>