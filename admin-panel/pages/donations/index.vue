<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEvents, type Event } from '@/composables/useEvents'
import EventCard from '@/components/events/EventCard.vue'

const { fetchEvents } = useEvents()
const events = ref<Event[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    events.value = await fetchEvents()
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unexpected error occurred.'
    }
  }
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">All Events</h1>
      <NuxtLink
        to="/events/create"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Create Event
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500">Loading events...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div
      v-if="events.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <EventCard v-for="event in events" :key="event._id" :event="event" />
    </div>
    <div v-else-if="!loading" class="text-gray-600">No events found.</div>
  </div>
</template>
