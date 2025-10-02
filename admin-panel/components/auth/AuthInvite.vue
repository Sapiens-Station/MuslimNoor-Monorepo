<template>
    <div
      class="hidden md:flex w-2/5 lg:w-2/5 bg-[#11B175] text-white flex-col items-center justify-center p-12"
    >
      <div class="flex flex-col items-center text-center max-w-sm">
        <h2 class="text-3xl font-bold mb-2">{{ title }}</h2>
        <div class="w-16 h-[2px] bg-white mb-6"></div>
  
        <p class="mb-8">
          {{ message }}
        </p>
  
        <NuxtLink
          :to="linkTo"
          class="px-10 py-2 border-2 border-white rounded-full hover:bg-white hover:text-[#11B175] transition text-sm font-medium"
        >
          {{ linkLabel }}
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    message: string
    linkTo: string
    linkLabel: string
  }>()
  </script>
  