<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <p><strong>Name:</strong> {{ donation.name }}</p>
    <p><strong>Email:</strong> {{ donation.email }}</p>
    <p><strong>Amount:</strong> ${{ donation.amount }}</p>
    <p class="text-sm text-gray-500">{{ formatDate(donation.createdAt) }}</p>

    <div class="flex justify-between pt-2">
      <NuxtLink :to="`/donations/${donation._id}`" class="text-blue-600">View</NuxtLink>
      <NuxtLink :to="`/donations/${donation._id}/edit`" class="text-yellow-600">Edit</NuxtLink>
      <button @click="emit('delete', donation._id!)" class="text-red-600">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DonationInterface } from '@/interfaces/donation.interface'

defineProps<{ donation: DonationInterface & { _id: string } }>()
const emit = defineEmits<{ (e: 'delete', id: string): void }>()

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleString() : ''
}
</script>
