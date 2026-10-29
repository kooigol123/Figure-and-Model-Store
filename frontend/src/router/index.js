import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // นำเข้าหน้า Home
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // หน้าแรกแสดงข้อความต้อนรับและสินค้า
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView // หน้าแสดงรายการสินค้าทั้งหมด
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView
    }
  ]
})

export default router