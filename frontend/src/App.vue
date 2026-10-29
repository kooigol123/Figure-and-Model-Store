<template>
  <div id="app">
    <MainMenu v-if="showNavbar" />
    <router-view />
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
body {
  margin: 0;
  font-family: 'Prompt', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}
</style>
