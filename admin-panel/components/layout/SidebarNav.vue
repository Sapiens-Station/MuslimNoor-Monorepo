<template>
    <div>
      <h2 class="text-2xl font-semibold mb-6">🕌 Muslim Noor</h2>
      <nuxt-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800 font-bold': $route.path.startsWith(item.to) }"
      >
        {{ item.label }}
      </nuxt-link>
  
      <UButton
        color="red"
        block
        class="mt-8"
        icon="i-heroicons-arrow-left-on-rectangle"
        @click="$emit('logout')"
      >
        Logout
      </UButton>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ navItems: { to: string; label: string }[] }>()
  defineEmits(['logout'])
  </script>
  