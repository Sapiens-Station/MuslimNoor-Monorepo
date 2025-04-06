<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold">{{ donation.name }}</h2>
    <p class="text-sm text-gray-600">Amount: ${{ donation.amount }}</p>
    <p class="text-sm text-gray-600">Email: {{ donation.email }}</p>
    <p class="text-sm text-gray-500">Date: {{ formatDate(donation.createdAt) }}</p>

    <div class="mt-4 flex justify-between">
      <NuxtLink :to="`/donations/${donation._id}`" class="text-blue-600 hover:underline">View</NuxtLink>
      <NuxtLink :to="`/donations/${donation._id}/edit`" class="text-yellow-600 hover:underline">Edit</NuxtLink>
      <button @click="emit('delete', donation._id!)" class="text-red-600 hover:underline">Delete</button>
    </div>
  </div>
</template>



<script setup lang="ts">
import type { DonationInterface } from '@/interfaces/donation.interface' // ✅ use `@` for type-safe paths

defineProps<{
  donation: DonationInterface
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

function formatDate(dateStr?: string) {
  return dateStr ? new Date(dateStr).toLocaleString() : ''
}
</script>