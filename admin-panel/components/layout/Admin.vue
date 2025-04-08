<template>
    <div class="flex min-h-screen">
      <!-- Sidebar / Navigation Drawer -->
      <UNavigationDrawer v-model="drawer" class="md:hidden">
        <SidebarNav :nav-items="navItems" @logout="logout" />
      </UNavigationDrawer>
  
      <aside class="w-64 bg-gray-900 text-white p-6 space-y-4 hidden md:block">
        <SidebarNav :nav-items="navItems" @logout="logout" />
      </aside>
  
      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Topbar with Drawer Toggle -->
        <UHeader class="shadow px-4 py-3 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <UButton
              icon="i-heroicons-bars-3"
              variant="ghost"
              class="md:hidden"
              @click="drawer = true"
            />
            <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          <UDropdown :items="profileMenu" :popper="{ placement: 'bottom-end' }">
            <UButton label="Admin" trailing-icon="i-heroicons-chevron-down" />
          </UDropdown>
        </UHeader>
  
        <!-- Page Content -->
        <main class="p-6 bg-gray-50 flex-1">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import SidebarNav from '~/components/layout/SidebarNav.vue'
  
  const router = useRouter()
  const drawer = ref(false)
  
  const navItems = [
    { to: '/dashboard/salat', label: 'Salat & Jamat' },
    { to: '/dashboard/events', label: 'Events' },
    { to: '/dashboard/donations', label: 'Donations' }
  ]
  
  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  const profileMenu = [
    [
      { label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', click: logout }
    ]
  ]
  </script>
  
  <style scoped>
  /* Optional custom styles */
  </style>
  