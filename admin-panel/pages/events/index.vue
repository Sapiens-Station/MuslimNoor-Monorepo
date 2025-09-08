<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useEvents } from '@/composables/useEvents';
import EventCard from '@/components/events/EventCard.vue';
import type { EventModel } from '~/interfaces/event.interface';

const { fetchEvents, deleteEvent } = useEvents();
const loading = ref(true);
const error = ref('');
const events = ref<EventModel[]>([]);

onMounted(async () => {
  try {
    events.value = await fetchEvents();
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
});

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await deleteEvent(id);
    events.value = await fetchEvents();
  }
};
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
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div
      v-else-if="events.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <EventCard
        v-for="event in events"
        :key="event._id"
        :event="event"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-gray-600">No events found.</div>
  </div>
</template>
