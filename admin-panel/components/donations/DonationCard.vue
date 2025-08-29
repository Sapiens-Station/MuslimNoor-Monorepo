<template>
  <UCard class="p-4">
    <div class="space-y-1 text-sm">
      <p><strong>Name:</strong> {{ donation.name }}</p>
      <p><strong>Email:</strong> {{ donation.email }}</p>
      <p><strong>Amount:</strong> ${{ donation.amount }}</p>
      <p class="text-gray-500 text-xs">{{ formatDate(donation.createdAt) }}</p>
    </div>
    <template #footer>
      <div class="flex justify-between text-sm">
        <NuxtLink :to="`/donations/${donation._id}`" class="text-blue-600">View</NuxtLink>
        <NuxtLink :to="`/donations/${donation._id}/edit`" class="text-yellow-600">Edit</NuxtLink>
        <UButton color="red" size="xs" variant="ghost" @click="emit('delete', donation._id!)">Delete</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { DonationInterface } from '@/interfaces/donation.interface'

defineProps<{ donation: DonationInterface & { _id: string } }>()
const emit = defineEmits<{ (e: 'delete', id: string): void }>()

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleString() : ''
}
</script>