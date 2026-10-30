<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <MainMenu v-if="showNavbar" />
    <div class="flex-grow-1">
      <router-view />
    </div>
    <footer v-if="showNavbar" class="site-footer py-4 mt-auto border-top bg-white">
      <div class="container d-flex flex-wrap justify-content-between align-items-center text-secondary" style="font-size: 0.82rem;">
        <div>© 2025 Model Store — Model & Figure Store</div>
        <div>โครงงานรายวิชาการพัฒนาเว็บแอปพลิเคชัน</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainMenu from './components/MainMenu.vue'

const route = useRoute()
// หน้า login / register ไม่แสดง navbar
const showNavbar = computed(() => {
  return !['/login', '/register'].includes(route.path)
})
</script>

<style>
/* ตั้งค่า Font Sarabun ทั่วทั้งระบบ ครอบคลุมทั้ง Text, Input, Button, Dropdown */
*, body, button, input, select, textarea {
  font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

body {
  margin: 0;
  background-color: #f8fafc;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
