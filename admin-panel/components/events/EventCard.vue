<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <img v-if="event.imageUrl" :src="event.imageUrl" class="w-full h-40 object-cover" >
    <div class="p-4">
      <h2 class="text-lg font-bold">{{ event.title }}</h2>
      <p class="text-sm text-gray-600">{{ event.date }}</p>
      <p class="mt-2 text-gray-700 line-clamp-3">{{ event.description }}</p>

      <div class="mt-4 flex justify-between items-center">
        <div class="space-x-3">
          <NuxtLink :to="`/events/${event._id}`" class="text-blue-600 hover:underline">View</NuxtLink>
          <NuxtLink :to="`/events/${event._id}/edit`" class="text-yellow-600 hover:underline">Edit</NuxtLink>
        </div>
        <button @click="emit('delete', event._id!)" class="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use a single, clean import
import type { EventInterface } from '@/interfaces/event.interface'

defineProps<{
  event: EventInterface & { _id: string }
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()
</script>

