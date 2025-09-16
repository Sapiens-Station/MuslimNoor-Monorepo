<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white shadow-lg rounded-lg flex w-full max-w-6xl overflow-hidden">
        
        <!-- Left: Auth Form -->
        <div class="relative w-full md:w-3/5 lg:w-3/5 bg-white flex flex-col">
          <!-- Logo (top-left) -->
          <div class="absolute top-6 left-6">
            <Logo />
          </div>
  
          <!-- Form Slot -->
          <div class="flex flex-1 items-center justify-center py-12">
            <slot />
          </div>
        </div>
  
        <!-- Right: Sign Up Invite -->
        <div class="hidden md:flex w-2/5 lg:w-2/5 bg-[#11B175] text-white flex-col items-center justify-center p-12">
          <h2 class="text-3xl font-bold mb-2">Hello, Friend!</h2>
          <div class="w-16 h-[2px] bg-white mb-4"></div>
          <p class="mb-8 text-center">
            Fill up personal information and start journey with us.
          </p>
          <NuxtLink
            to="/auth/register"
            class="px-10 py-2 border-2 border-white rounded-full hover:bg-white hover:text-[#11B175] transition"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Logo from '../components/ui/Logo.vue'
  </script>
  