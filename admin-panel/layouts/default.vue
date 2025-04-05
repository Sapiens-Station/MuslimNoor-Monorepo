<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white p-6 space-y-4 hidden md:block">
      <h2 class="text-2xl font-semibold mb-6">🕌 Muslim Noor</h2>
      <nuxt-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800 font-bold': route.path.startsWith(item.to) }"
      >
        {{ item.label }}
      </nuxt-link>
      <button
        @click="logout"
        class="mt-8 bg-red-600 w-full py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <header
        class="bg-white shadow px-4 py-3 flex items-center justify-between"
      >
        <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <div class="md:hidden">
          <!-- You can make this a dropdown for mobile later -->
          <button class="text-sm text-blue-600" @click="logout">Logout</button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 bg-gray-50 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { to: '/dashboard/salat', label: 'Salat & Jamat' },
  { to: '/dashboard/events', label: 'Events' },
  { to: '/dashboard/donations', label: 'Donations' },
]

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
