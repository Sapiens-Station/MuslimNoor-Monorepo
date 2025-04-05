<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <img
      v-if="event.imageUrl"
      :src="event.imageUrl"
      alt="Event image"
      class="w-full h-40 object-cover"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold">{{ event.title }}</h2>
      <p class="text-sm text-gray-600">{{ event.date }}</p>
      <p class="mt-2 text-gray-700 line-clamp-3">{{ event.description }}</p>

      <div class="mt-4 flex justify-between">
        <nuxt-link
          :to="`/events/${event._id}`"
          class="text-blue-600 hover:underline"
          >View</nuxt-link
        >
        <nuxt-link
          :to="`/events/${event._id}/edit`"
          class="text-yellow-600 hover:underline"
          >Edit</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  event: {
    _id?: string
    title: string
    description: string
    date: string
    imageUrl?: string
  }
}>()
</script>
