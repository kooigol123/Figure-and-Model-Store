import { createRouter, createWebHistory } from "vue-router";

import Product from "@/components/Product.vue";
import Home from "@/components/Home.vue";
import LoginView from "@/views/LoginView.vue"; // หน้า Login + Register (แท็บเดียวกัน)
import PageMember from '@/components/PageMember.vue';
import ProductShow from "../components/ProductShow.vue"
import CartShow from "@/components/CartShow.vue";
import OrderHistory from "@/components/OrderHistory.vue";
import AdminBackoffice from "@/components/AdminBackoffice.vue";
import { useAuthStore } from "@/stores/authStore";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/product',
        name: 'product',
        component: Product,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: LoginView // เปิดแท็บสมัครสมาชิก
    },
    {
        path: '/pagemember',
        name: 'PageMember',
        component: PageMember,
        meta: { requiresAuth: true }
    },
    {
        path: '/ProductShow/:pdId',
        name: 'ProductShow',
        component: ProductShow,
    },
    {
        path: '/cart',
        name: 'CartShow',
        component: CartShow,
        meta: { requiresAuth: true }
    },
    {
        path: '/orderhistory',
        name: 'OrderHistory',
        component: OrderHistory,
        meta: { requiresAuth: true }
    },
    {
        path: '/backoffice',
        name: 'AdminBackoffice',
        component: AdminBackoffice,
        meta: { requiresAuth: true }
    },
    // path เดิมจาก views ชุดแรก
    { path: '/profile', redirect: '/pagemember' },
    { path: '/products', redirect: '/product' },
    { path: '/products/:id', redirect: to => `/ProductShow/${to.params.id}` },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), routes
})

router.beforeEach(async (to, from) => {
    if (to.meta.requiresAuth) {
        const authStore = useAuthStore()
        const user = await authStore.fetchMe()
        if (user) {
            return true;
        }
        else {
            return '/login'
        }
    }
    else {
        return true;
    }
})


export default router
